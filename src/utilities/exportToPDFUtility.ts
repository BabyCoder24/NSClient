import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Public types
export type PDFColumn = { field: string; headerName: string };
export type Orientation = "portrait" | "landscape";
export type PdfFormat =
  | "a0"
  | "a1"
  | "a2"
  | "a3"
  | "a4"
  | "a5"
  | "a6"
  | "letter"
  | "legal"
  | "tabloid"
  | [number, number];

export type CustomFontSpec = {
  name: string;
  normal?: string; // base64 (with/without data url) or URL
  bold?: string;
  italic?: string;
  bolditalic?: string;
  format?: "ttf" | "otf"; // default ttf
};

export type PdfMeta = {
  title?: string;
  subject?: string;
  author?: string;
  keywords?: string | string[];
  creator?: string;
};

// Grid-like optional models for filtering/sorting/visibility
export type PdfSortModel = { field: string; sort?: "asc" | "desc" }[];
export type PdfFilterItem = { field?: string; operator?: string; value?: any };
export type PdfFilterModel = {
  items?: PdfFilterItem[];
  quickFilterValues?: string[];
};
export type PdfVisibilityModel = Record<string, boolean>;

// Helpers
const ptToMm = 25.4 / 72;

function stripDataUrlPrefix(data?: string): string | undefined {
  if (!data) return undefined;
  const comma = data.indexOf(",");
  if (data.startsWith("data:") && comma !== -1) {
    return data.substring(comma + 1);
  }
  return data;
}

async function fetchAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      bytes.subarray(i, i + chunk) as unknown as number[]
    );
  }
  return btoa(binary);
}

async function addFontVariant(
  doc: jsPDF,
  name: string,
  style: "normal" | "bold" | "italic" | "bolditalic",
  dataOrUrl?: string,
  format: "ttf" | "otf" = "ttf"
) {
  if (!dataOrUrl) return;
  let base64 = stripDataUrlPrefix(dataOrUrl);
  if (!base64 && /^https?:\/\//i.test(dataOrUrl)) {
    base64 = await fetchAsBase64(dataOrUrl);
  }
  if (!base64) return;
  const fileName = `${name}-${style}.${format}`;
  doc.addFileToVFS(fileName, base64);
  doc.addFont(fileName, name, style);
}

function loadImageAsDataUrl(url?: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function exportToPDF({
  columns,
  rows,
  fileName = "export.pdf",
  title = "DataGrid Export",
  appName = "CMS System Administration",
  logoUrl,
  orientation = "portrait",
  format = "a4",
  formatCell,
  columnWidths,
  wrapLongText = true,
  customFont,
  pdfMeta,
  sortModel,
  filterModel,
  columnVisibilityModel,
}: {
  columns: PDFColumn[];
  rows: any[];
  fileName?: string;
  title?: string;
  appName?: string;
  logoUrl?: string;
  orientation?: Orientation;
  format?: PdfFormat;
  formatCell?: (
    value: any,
    field: string,
    row: any
  ) => string | number | null | undefined;
  columnWidths?: Record<string, number | "wrap" | "auto">;
  wrapLongText?: boolean;
  customFont?: CustomFontSpec;
  pdfMeta?: PdfMeta;
  sortModel?: PdfSortModel;
  filterModel?: PdfFilterModel;
  columnVisibilityModel?: PdfVisibilityModel;
}) {
  // Helpers similar to Excel util to mirror grid behavior
  const valueToString = (v: any): string => {
    if (v == null) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  };

  const normalizeColumns = (): PDFColumn[] => {
    const base = columns.filter((c) => c.field !== "actions");
    if (!columnVisibilityModel) return base;
    return base.filter((c) => columnVisibilityModel[c.field] !== false);
  };

  const matchesQuick = (row: any, fields: string[], values?: string[]) => {
    if (!values || values.length === 0) return true;
    const hay = fields
      .map((f) =>
        valueToString(formatCell ? formatCell(row[f], f, row) : row[f])
      )
      .map((s) => s.toLowerCase());
    return values.every((needle) => {
      const n = String(needle).toLowerCase();
      return hay.some((s) => s.includes(n));
    });
  };

  const matchesItems = (row: any, items?: PdfFilterItem[]) => {
    if (!items || items.length === 0) return true;
    return items.every((it) => {
      if (!it || !it.field) return true;
      const raw = row[it.field];
      const vStr = valueToString(raw).toLowerCase();
      const comp = valueToString(it.value).toLowerCase();
      const operator = it.operator;
      switch (operator) {
        case "contains":
          return vStr.includes(comp);
        case "equals":
        case "is":
          return vStr === comp;
        case "startsWith":
          return vStr.startsWith(comp);
        case "endsWith":
          return vStr.endsWith(comp);
        case "isEmpty":
          return vStr === "";
        case "isNotEmpty":
          return vStr !== "";
        default: {
          const num = Number(vStr);
          const cmp = Number(comp);
          if (!Number.isNaN(num) && !Number.isNaN(cmp)) {
            switch (operator) {
              case ">":
                return num > cmp;
              case ">=":
                return num >= cmp;
              case "<":
                return num < cmp;
              case "<=":
                return num <= cmp;
              case "!=":
              case "not":
                return num !== cmp;
            }
          }
          return vStr.includes(comp);
        }
      }
    });
  };

  const applySort = (a: any, b: any, m?: PdfSortModel, fields?: string[]) => {
    if (!m || m.length === 0) return 0;
    const flds = fields || [];
    for (const rule of m) {
      const { field, sort } = rule;
      if (!sort || (flds.length > 0 && !flds.includes(field))) continue;
      const av = a[field];
      const bv = b[field];
      if (av == null && bv == null) continue;
      if (av == null) return sort === "asc" ? -1 : 1;
      if (bv == null) return sort === "asc" ? 1 : -1;
      if (av < bv) return sort === "asc" ? -1 : 1;
      if (av > bv) return sort === "asc" ? 1 : -1;
    }
    return 0;
  };

  const doc = new jsPDF({ unit: "mm", format, orientation });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // PDF metadata
  if (pdfMeta) {
    doc.setProperties({
      title: pdfMeta.title ?? title,
      subject: pdfMeta.subject,
      author: pdfMeta.author,
      keywords: Array.isArray(pdfMeta.keywords)
        ? pdfMeta.keywords.join(", ")
        : pdfMeta.keywords,
      creator: pdfMeta.creator,
    });
  }

  // Embed custom font if provided
  if (customFont?.name) {
    const fmt = customFont.format || "ttf";
    await addFontVariant(
      doc,
      customFont.name,
      "normal",
      customFont.normal,
      fmt
    );
    await addFontVariant(doc, customFont.name, "bold", customFont.bold, fmt);
    await addFontVariant(
      doc,
      customFont.name,
      "italic",
      customFont.italic,
      fmt
    );
    await addFontVariant(
      doc,
      customFont.name,
      "bolditalic",
      customFont.bolditalic,
      fmt
    );
    if (customFont.normal) doc.setFont(customFont.name, "normal");
  }

  // Layout constants to match print
  const margin = 25.4; // 2.54 cm
  const footerHeight = 12;

  // Prepare columns and data according to optional models
  const visibleCols = normalizeColumns();
  const fields = visibleCols.map((c) => c.field);
  const filteredRows = rows.filter(
    (r) =>
      matchesQuick(r, fields, filterModel?.quickFilterValues) &&
      matchesItems(r, filterModel?.items)
  );
  const sortedRows = [...filteredRows].sort((a, b) =>
    applySort(a, b, sortModel, fields)
  );

  const headers = visibleCols.map((c) => c.headerName);
  const data = sortedRows.map((row) =>
    visibleCols.map((c) => {
      const raw =
        typeof formatCell === "function"
          ? formatCell(row[c.field], c.field, row)
          : row[c.field];
      return raw == null ? "" : String(raw);
    })
  );

  // Load logo, compute header layout
  const logoDataUrl = await loadImageAsDataUrl(logoUrl);
  const printDate = new Date().toLocaleString();

  const logoW = logoDataUrl ? 12 : 0;
  const logoH = logoDataUrl ? 12 : 0;
  const gap = logoDataUrl ? 3 : 0;
  const availableWidth = pageWidth - margin * 2;

  let appFontSize = 18;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(appFontSize);
  let appNameWidth = doc.getTextWidth(appName);
  let totalHeaderLineWidth = logoW + (logoW ? gap : 0) + appNameWidth;
  while (totalHeaderLineWidth > availableWidth && appFontSize > 12) {
    appFontSize -= 1;
    doc.setFontSize(appFontSize);
    appNameWidth = doc.getTextWidth(appName);
    totalHeaderLineWidth = logoW + (logoW ? gap : 0) + appNameWidth;
  }
  const appTextHeightMm = appFontSize * ptToMm;
  const headerBlockHeight = Math.max(logoH, appTextHeightMm);
  const titleGap = 6;
  const headerHeight = headerBlockHeight + titleGap + 6;

  const tableMargin = {
    top: margin + headerHeight,
    bottom: margin + footerHeight,
    left: margin,
    right: margin,
  } as const;

  const green: [number, number, number] = [46, 125, 50];
  const orange: [number, number, number] = [255, 152, 0];
  const grayText: [number, number, number] = [102, 102, 102];

  // Column widths/wrap styles mapping by index
  const columnStyles: Record<number, any> = {};
  if (columnWidths) {
    visibleCols.forEach((c, idx) => {
      const w = columnWidths[c.field];
      if (w === "wrap") {
        columnStyles[idx] = { ...(columnStyles[idx] || {}), cellWidth: "wrap" };
      } else if (w === "auto" || w == null) {
        // let autotable auto-size
      } else {
        columnStyles[idx] = { ...(columnStyles[idx] || {}), cellWidth: w };
      }
    });
  }

  autoTable(doc, {
    head: [headers],
    body: data,
    margin: tableMargin,
    columnStyles,
    styles: {
      fontSize: 10,
      lineColor: orange,
      lineWidth: 0.2,
      cellPadding: 2.5,
      halign: "left",
      valign: "middle",
      overflow: wrapLongText ? "linebreak" : "visible",
    },
    headStyles: {
      fillColor: green,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      lineColor: orange,
      lineWidth: 0.2,
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    theme: "grid",
    didDrawPage: (data: any) => {
      // Draw application header only on the first page
      if (data?.pageNumber !== 1) return;

      const headerTopY = margin;
      const centerX = pageWidth / 2;

      const startX = centerX - totalHeaderLineWidth / 2;
      const centerY = headerTopY + headerBlockHeight / 2;

      if (logoDataUrl && logoW && logoH) {
        doc.addImage(
          logoDataUrl,
          "PNG",
          startX,
          centerY - logoH / 2,
          logoW,
          logoH
        );
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(appFontSize);
      doc.setTextColor(46, 125, 50);
      const textX = startX + (logoW ? logoW + gap : 0);
      doc.text(appName, textX, centerY, { baseline: "middle" });

      const titleY = headerTopY + headerBlockHeight + titleGap;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(title, centerX, titleY, { align: "center" });
    },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const y = pageHeight - margin + footerHeight / 2;
    doc.setFontSize(10);
    doc.setTextColor(...grayText);
    doc.text(`Downloaded on: ${printDate}`, margin, y, { baseline: "middle" });
    const pageLabel = `Page ${i} of ${pageCount}`;
    doc.text(pageLabel, pageWidth - margin, y, {
      align: "right",
      baseline: "middle",
    });
  }

  doc.save(fileName);
}
