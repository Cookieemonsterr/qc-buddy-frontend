import React, { useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://qc-buddy-backend.onrender.com";

export default function TagSuggestor({ market }) {
  const [text, setText] = useState("");
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    const items = text.split("\n").map(s => s.trim()).filter(Boolean);
    if (!items.length) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/suggest-tags`, {
        // change to `${API_BASE}/api/suggest-tags` if your backend uses /api
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, market }),
      });

      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${t}`);
      }

      setOut(await res.json());
    } catch (err) {
      console.error(err);
      setOut({
        cuisineTags: [],
        extraTags: [],
        reasoning: [],
        notes: ["Couldn’t reach backend."],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-qcPanel border border-qcAccent/20 rounded-xl2 p-3 text-[11px] text-white/70 flex flex-col gap-2 shadow-soft">
      <div className="text-white/90 font-medium text-[12px]">Tag Suggestor</div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste item names, one per line…"
        rows={5}
        className="w-full rounded-lg p-2 bg-black/20 border border-qcAccent/20 text-white text-[12px] outline-none"
      />

      <button
        onClick={run}
        disabled={loading}
        className="self-start text-[12px] bg-qcAccent text-black font-semibold rounded-lg px-3 py-2 shadow-soft"
      >
        {loading ? "Thinking…" : "Suggest tags"}
      </button>

      {out && (
        <div className="mt-2 space-y-2">
          <div><b>Cuisine tags:</b> {out.cuisineTags?.join(", ") || "—"}</div>
          {out.extraTags?.length ? (
            <div><b>Extra tags:</b> {out.extraTags.join(", ")}</div>
          ) : null}
          <div className="space-y-1">
            {out.reasoning?.map((r, i) => <div key={i}>• {r}</div>)}
            {out.notes?.map((n, i) => <div key={i} className="text-white/50">- {n}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
