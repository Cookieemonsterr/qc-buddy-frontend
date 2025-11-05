import React, { useRef, useState } from "react";

export default function FileUploadBox({ market, onResults, apiBase }) {
  const API_BASE = apiBase || import.meta.env.VITE_API_URL || "https://qc-buddy-backend.onrender.com";
  const ref = useRef(null);
  const [status, setStatus] = useState("");

  async function tryUpload(fd) {
    const paths = ["/bulk-qc", "/api/bulk-qc", "/upload", "/api/upload"];
    let lastErr = null;
    for (const p of paths) {
      try {
        const r = await fetch(`${API_BASE}${p}`, { method: "POST", body: fd });
        if (r.ok) return { ok: true, data: await r.json(), url: `${API_BASE}${p}` };
        lastErr = `HTTP ${r.status} ${await r.text().catch(()=> "")}`;
      } catch (e) {
        lastErr = e?.message || "Network error";
      }
    }
    return { ok: false, error: lastErr };
  }

  async function handle(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Uploading…");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("market", market);

    const resp = await tryUpload(fd);
    if (resp.ok) {
      const d = resp.data || {};
      setStatus(`Checked ${d.totalRows ?? "?"} rows • ${d.rowsWithIssues ?? "?"} rows need fixes`);
      onResults?.(d);
    } else {
      setStatus(`Upload failed: ${resp.error || "Unknown"}`);
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
