import React from "react";
import { utils as XLSXUtils, writeFileXLSX } from "xlsx";

export default function BatchResultsPanel({ open, results, onClose }) {
  if (!open) return null;
  const { report = [], fixedRows = [], totalRows = 0, rowsWithIssues = 0 } = results || {};

  function downloadCleanCSV() {
    // Use a simple CSV via XLSX (works offline)
    const ws = XLSXUtils.json_to_sheet(fixedRows);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, "Cleaned");
    writeFileXLSX(wb, `menu_fixed_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  return (
    <div className="w-[420px] bg-qcPanel border-l border-qcAccent/20 p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-white">Batch QC Results</div>
        <button className="text-[11px] underline" onClick={onClose}>Close</button>
      </div>

      <div className="text-[11px] text-white/70 mb-3">
        Checked {totalRows} rows. <span className="text-white/90">{rowsWithIssues}</span> rows need fixes.
      </div>

      <button
        className="text-[12px] mb-4 bg-qcAccent text-black font-semibold rounded-lg px-3 py-2 shadow-soft"
        onClick={downloadCleanCSV}
      >
        Download Clean File
      </button>

      <div className="space-y-2">
        {report.slice(0,500).map((r, i) => (
          <div key={i} className="text-[11px] p-2 bg-qcBubble/50 rounded-lg border border-qcAccent/20">
            <div className="text-white/90">Row {r.row_index} • <b>{r.field}</b> • {r.type}</div>
            <div className="text-white/70">{r.message}</div>
            {r.fix && <div className="text-qcAccent mt-1">Suggestion: {String(r.fix)}</div>}
          </div>
        ))}
        {report.length > 500 && (
          <div className="text-[11px] text-white/50">(+{report.length-500} more…)</div>
        )}
      </div>
    </div>
  );
}
