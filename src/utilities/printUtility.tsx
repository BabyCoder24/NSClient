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
  logoUrl,
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
    // const printDate = useMemo(() => new Date().toLocaleString(), []);

    return (
      <div ref={ref as React.RefObject<HTMLDivElement>}>
        <style>
          {`
            * { box-sizing: border-box; }
            body { font-family: Roboto, Arial, sans-serif; }
            /* Avoid reserving extra space at the bottom which can create a trailing blank page */
            .print-root { padding: 0; }
            .header { display: flex; align-items: center; justify-content: center; margin-bottom: 16px; text-align: center; }
            .logo { height: 48px; width: 48px; object-fit: contain; margin-right: 12px; }
            .app-name { font-size: 2rem; font-weight: 700; color: #2e7d32; letter-spacing: 1px; }
            h1 { color: #000; text-align: center; margin: 16px 0; font-size: 1.5rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; box-shadow: 0 2px 8px rgba(44, 62, 80, 0.08); }
            th, td { border: 1px solid #ff9800; padding: 8px 10px; text-align: left; font-size: 14px; }
            th { background: #2e7d32; color: #fff; font-size: 15px; font-weight: 600; }
            tr:nth-child(even) { background: #f5f5f5; }
            .footer { position: fixed; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: space-between; padding: 8px 0; color: #666; font-size: 12px; }
            .footer .left { padding-left: 0; }
            .footer .right { padding-right: 0; }
            @media print {
              @page { margin: 2.54cm; }
              body { margin: 0; }
              .no-print { display: none !important; }
              /* Keep table headers repeating and avoid splitting rows across pages */
              thead { display: table-header-group; }
              tfoot { display: table-footer-group; }
              table { page-break-inside: auto; break-inside: auto; }
              tr { page-break-inside: avoid; break-inside: avoid; }
              td, th { page-break-inside: avoid; break-inside: avoid; }
              /* Page number counters (browser support varies; works in Chromium) */
              .pageNumber::after { content: counter(page); }
              .totalPages::after { content: counter(pages); }
            }
            ${extraStyles || ""}
          `}
        </style>

        <div className="print-root">
          <div className="header">
            {logoUrl ? <img src={logoUrl} alt="logo" className="logo" /> : null}
            <div className="app-name">{appName}</div>
          </div>

          <h1>{title}</h1>

          <table>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.field}>{c.headerName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(maxRowsPerPage && maxRowsPerPage > 0
                ? rows.slice(0, maxRowsPerPage)
                : rows
              ).map((row, idx) => (
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

          {/* <div className="footer">
            <div className="left">Printed on: {printDate}</div>
            <div className="right">
              Page <span className="pageNumber" /> of{" "}
              <span className="totalPages" />
            </div>
          </div> */}
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
