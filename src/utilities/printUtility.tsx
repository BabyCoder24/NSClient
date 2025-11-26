import React, { useRef } from "react";
import { createRoot } from "react-dom/client";
import { useReactToPrint } from "react-to-print";

export type PrintColumn = { field: string; headerName: string };

export type PrintUtilityOptions = {
  title: string;
  columns: PrintColumn[];
  rows: any[];
  appName?: string;
  logoUrl?: string;
  /**
   * Optional CSS string to inject on the print document.
   * Will be appended after the default styles so you can override them.
   */
  extraStyles?: string;
  /**
   * Callback to transform a cell value before printing.
   */
  formatCell?: (value: any, field: string, row: any) => React.ReactNode;
  /**
   * Optional document title for the print window/tab.
   * Defaults to appName.
   */
  documentTitle?: string;
  /**
   * Allow caller to control page size/orientation via CSS class.
   * For example: "@page { size: A4 landscape; }" in extraStyles.
   */
  /**
   * Optional hard cap per page to avoid the final nearly-empty page
   * if the browser breaks differently. If omitted, uses style-only approach.
   */
  maxRowsPerPage?: number;
};

/**
 * Programmatic print utility built on top of react-to-print.
 * It renders an off-DOM React tree with the printable content and invokes printing.
 * Usage stays simple and imperative.
 */
export function printUtility({
  title,
  columns,
  rows,
  appName = "NS Solutions",
  logoUrl = "/logo.png",
  extraStyles,
  formatCell,
  documentTitle,
  maxRowsPerPage,
}: PrintUtilityOptions) {
  // Create a detached container for rendering printable content
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  document.body.appendChild(container);

  // Printable component encapsulated to be compatible with react-to-print
  const Printable = React.forwardRef<HTMLDivElement>((_, ref) => {
    const printDate = new Date().toLocaleString();
    const firstPageRows = 5;
    const subsequentPageRows = 10;
    const effectiveRows =
      maxRowsPerPage && maxRowsPerPage > 0
        ? rows.slice(0, maxRowsPerPage)
        : rows;
    const pages: any[][] = [];
    let remainingRows = effectiveRows;
    if (remainingRows.length > 0) {
      pages.push(remainingRows.slice(0, firstPageRows));
      remainingRows = remainingRows.slice(firstPageRows);
    }
    while (remainingRows.length > 0) {
      pages.push(remainingRows.slice(0, subsequentPageRows));
      remainingRows = remainingRows.slice(subsequentPageRows);
    }

    return (
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <style>
          {`
            * { box-sizing: border-box; }
            body { font-family: 'Roboto', 'Arial', sans-serif; margin: 0; padding: 0; }
            .print-root { max-width: 100%; }
            .print-page { 
              display: flex; 
              flex-direction: column; 
              min-height: 100vh; 
              padding: 20px; 
              page-break-after: always; 
            }
            .print-page:last-child { page-break-after: avoid; }
            .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; padding-bottom: 3px; border-bottom: 2px solid #e0e0e0; }
            .company-info { display: flex; flex-direction: column; }
            .company-name { font-size: 1.1rem; font-weight: 700; color: #1976d2; letter-spacing: 1px; }
            .company-tagline { font-size: 0.7rem; color: #666; font-weight: 400; margin-top: 2px; }
            .logo { height: 100px; width: 100px; object-fit: contain; }
            .content { flex: 1; margin-bottom: 20px; padding-bottom: 10px; }
            .title { color: #000; text-align: center; margin: 10px 0; font-size: 1rem; font-weight: 600; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden; }
            th, td { border: 1px solid #ddd; padding: 12px 15px; text-align: left; font-size: 9px; }
            th { background: #4dabf5; color: #fff; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            tr:nth-child(even) { background: #fafafa; }
            tr:hover { background: #f5f5f5; }
            .footer { 
              margin-top: auto;
              display: flex; 
              align-items: center; 
              justify-content: space-between; 
              padding: 15px 0; 
              color: #666; 
              font-size: 12px; 
              border-top: 2px solid #e0e0e0; 
            }
            .footer .left { font-weight: 500; }
            .footer .right { font-weight: 500; }
            @media print {
              @page { margin: 2.54cm; }
              body { margin: 0; }
              .no-print { display: none !important; }
              .header { page-break-inside: avoid; }
              .content { page-break-inside: avoid; }
              .print-page { page-break-after: always; }
              .print-page:last-child { page-break-after: avoid; }
              /* Keep table headers repeating and avoid splitting rows across pages */
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              table { page-break-inside: auto; break-inside: auto; }
              tr { page-break-inside: avoid; break-inside: avoid; }
              td, th { page-break-inside: avoid; break-inside: avoid; }
            }
            ${extraStyles || ""}
          `}
        </style>

        <div className="print-root">
          {pages.map((pageRows, pageIndex) => (
            <div key={pageIndex} className="print-page">
              {pageIndex === 0 && (
                <>
                  <div className="header">
                    <div className="company-info">
                      <div className="company-name">{appName}</div>
                      <div className="company-tagline">
                        Innovative solutions for your business needs.
                      </div>
                    </div>
                    {logoUrl ? (
                      <img src={logoUrl} alt="logo" className="logo" />
                    ) : null}
                  </div>

                  <div className="content">
                    <h1 className="title">{title}</h1>

                    <table>
                      <thead>
                        <tr>
                          {columns.map((c) => (
                            <th key={c.field}>{c.headerName}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pageRows.map((row, idx) => (
                          <tr key={idx}>
                            {columns.map((c) => (
                              <td key={c.field}>
                                {formatCell
                                  ? formatCell(row[c.field], c.field, row)
                                  : String(row[c.field] ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {pageIndex > 0 && (
                <div className="content">
                  <table>
                    <thead>
                      <tr>
                        {columns.map((c) => (
                          <th key={c.field}>{c.headerName}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pageRows.map((row, idx) => (
                        <tr key={idx}>
                          {columns.map((c) => (
                            <td key={c.field}>
                              {formatCell
                                ? formatCell(row[c.field], c.field, row)
                                : String(row[c.field] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="footer">
                <div className="left">Printed on: {printDate}</div>
                <div className="right">Page {pageIndex + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  });
  Printable.displayName = "Printable";

  // A small helper component to wire up useReactToPrint and run it once
  const PrintInvoker: React.FC = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({
      contentRef, // v3 API replaces `content: () => ...`
      documentTitle: documentTitle || title,
      onAfterPrint: cleanup,
    });

    // Fire once after first render
    React.useEffect(() => {
      // defer to ensure contentRef is populated
      const id = requestAnimationFrame(() => handlePrint());
      return () => cancelAnimationFrame(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Printable ref={contentRef} />;
  };

  // Mount the invoker into our detached container
  const root = createRoot(container);
  root.render(<PrintInvoker />);

  function cleanup() {
    try {
      root.unmount();
    } catch {}
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
