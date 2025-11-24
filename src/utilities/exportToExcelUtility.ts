import * as XLSX from "xlsx";

export type ExcelColumn = { field: string; headerName: string };
export type ExcelSortModel = { field: string; sort?: "asc" | "desc" }[];
export type ExcelFilterItem = {
  field?: string;
  operator?: string;
  value?: any;
};
export type ExcelFilterModel = {
  items?: ExcelFilterItem[];
  quickFilterValues?: string[];
};
export type ExcelVisibilityModel = Record<string, boolean>;

export function exportToExcel({
  columns,
  rows,
  fileName = "users_export.xlsx",
  sortModel,
  filterModel,
  columnVisibilityModel,
  formatCell,
}: {
  columns: ExcelColumn[];
  rows: any[];
  fileName?: string;
  sortModel?: ExcelSortModel;
  filterModel?: ExcelFilterModel;
  columnVisibilityModel?: ExcelVisibilityModel;
  formatCell?: (value: any, field: string, row: any) => any;
}) {
  // Helper utils (mirrors the DataGrid behavior used elsewhere)
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

  const normalizeColumns = (): ExcelColumn[] => {
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

  const matchesItems = (row: any, items?: ExcelFilterItem[]) => {
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

  const applySort = (a: any, b: any, m?: ExcelSortModel, fields?: string[]) => {
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

  const visibleCols = normalizeColumns();
  const fields = visibleCols.map((c) => c.field);
  const filtered = rows.filter(
    (r) =>
      matchesQuick(r, fields, filterModel?.quickFilterValues) &&
      matchesItems(r, filterModel?.items)
  );
  const sorted = [...filtered].sort((a, b) =>
    applySort(a, b, sortModel, fields)
  );

  // Prepare data: first row is headers, then data rows
  const header = visibleCols.map((col) => col.headerName);
  const data = sorted.map((row) =>
    visibleCols.map((col) =>
      formatCell ? formatCell(row[col.field], col.field, row) : row[col.field]
    )
  );

  const worksheetData = [header, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
}
