// FileUploadBox.jsx
import React, { useRef, useState } from "react";

export default function FileUploadBox({ market, onResults, apiBase }) {
  const ref = useRef(null);
  const [status, setStatus] = useState("");

  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("market", market);

    try {
      const res = await fetch(`${apiBase}/fix-file`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) setStatus("⚠ " + data.error);
      else {
        setStatus(`Checked ${data.totalRows} rows • ${data.rowsWithIssues} rows need fixes`);
        onResults?.(data);
      }
    } catch (err) {
      setStatus(`Network error: ${err?.message || "failed"} 😵`);
    }
  }

  return (
    <div className="bg-qcPanel border border-qcAccent/20 rounded-xl2 p-3 text-[11px] text-white/70 flex flex-col gap-2 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-white/90 font-medium text-[12px]">Bulk QC (CSV)</span>
        <button className="text-[11px] bg-qcAccent text-black font-semibold rounded-lg px-2 py-1 shadow-soft"
                onClick={()=>ref.current?.click()}>Upload file</button>
      </div>
      <div>Item images must be <b>1200×1200</b>. Hero images must be <b>1125×780</b>. I’ll flag anything else.</div>
      {status && <div className="text-white/80">{status}</div>}
      <input className="hidden" ref={ref} type="file" accept=".csv,text/csv" onChange={handle} />
    </div>
  );
}
