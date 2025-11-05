// App.jsx
import React, { useRef, useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import InputBar from "./InputBar.jsx";
import FileUploadBox from "./FileUploadBox.jsx";
import MarketSelector from "./MarketSelector.jsx";
import SourcePanel from "./SourcePanel.jsx";
import TagSuggestor from "./TagSuggestor.jsx";
import BatchResultsPanel from "./BatchResultsPanel.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "https://qc-buddy-backend.onrender.com";

// Try common routes until one works
async function postJSONWithFallback(body) {
  const candidates = [
    `${API_BASE}/chat`,
    `${API_BASE}/api/chat`,
    `${API_BASE}/ask`,
    `${API_BASE}/api/ask`,
    `${API_BASE}/`,           // some servers accept POST /
  ];
  let lastErr = null;
  for (const url of candidates) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) return { ok: true, data: await r.json(), url };
      lastErr = `HTTP ${r.status} ${await r.text().catch(()=> "")}`;
    } catch (e) {
      lastErr = e?.message || "Network error";
    }
  }
  return { ok: false, error: lastErr };
}

export default function App() {
  const [market, setMarket] = useState("AUTO");
  const [messages, setMessages] = useState([{
    role: "buddy",
    buddyMood: "happy",
    text:
      "I’m your QC Buddy 😼\n" +
      "Ask me rules, paste item names/descriptions for a quick check, or scroll down to run a Bulk QC on a whole CSV. " +
      "I’ll also suggest cuisine tags from your menu.\n\n" +
      "Tip: “is this correct for item name: banana pancake”",
    sources: [],
  }]);
  const [sources, setSources] = useState([]);
  const [showSources, setShowSources] = useState(true);
  const [backendStatus, setBackendStatus] = useState("checking…");

  const [batchResults, setBatchResults] = useState(null);
  const [showBatchPanel, setShowBatchPanel] = useState(false);
  const inputRef = useRef(null);

  // Quick health check
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/health`, { method: "GET" });
        setBackendStatus(r.ok ? "online" : `health: ${r.status}`);
      } catch {
        setBackendStatus("offline");
      }
    })();
  }, []);

  async function onSend() {
    const val = inputRef.current?.value ?? "";
    const text = val.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    inputRef.current.value = "";

    const resp = await postJSONWithFallback({ message: text, market });
    if (resp.ok) {
      const data = resp.data;
      setSources(data.sources || []);
      setMessages((prev) => [...prev, {
        role: "buddy",
        text: data.answer || "…",
        buddyMood: data.buddyMood || "happy",
        sources: data.sources || [],
      }]);
    } else {
      setMessages((prev) => [...prev, {
        role: "buddy",
        buddyMood: "confused",
        text:
          "I couldn’t reach the backend 😵‍💫\n" +
          `Base: ${API_BASE}\n` +
          `Error: ${resp.error || "Unknown"}\n` +
          "Tip: enable CORS and confirm the chat route (e.g. /chat or /api/chat).",
        sources: [],
      }]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0f11] text-white flex">
      <div className="flex-1 max-w-[1024px] mx-auto flex flex-col">
        <header className="sticky top-0 z-10 bg-[#0d0f11]/85 backdrop-blur border-b border-qcAccent/20">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-qcAccent text-black flex items-center justify-center font-bold shadow-soft">Q</div>
              <div>
                <div className="text-sm font-semibold">QC Buddy</div>
                <div className="text-[11px] text-white/60">Your onboarding + tagging + writing brain.</div>
                <div className="text-[11px] text-white/40">Backend: {backendStatus}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/60 mr-1">MARKET:</span>
              {["AUTO","AE","JO"].map(m=>(
                <button key={m}
                  onClick={()=>setMarket(m)}
                  className={`px-2 py-1 text-[11px] rounded-lg border ${market===m ? "bg-qcAccent text-black border-qcAccent":"border-qcAccent/30 text-white/80"}`}>
                  {m}
                </button>
              ))}
              <button onClick={()=>setShowSources(s=>!s)}
                className="ml-3 px-2 py-1 text-[11px] rounded-lg border border-qcAccent/30 text-white/80"
                title="Toggle sources">
                {showSources ? "Hide sources" : "Show sources"}
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role === "buddy" ? "buddy" : "user"} text={m.text} buddyMood={m.buddyMood} />
          ))}
        </div>

        <div className="border-t border-qcAccent/20 bg-qcPanel">
          <div className="px-5 py-4 space-y-4">
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                onKeyDown={handleKeyDown}
                rows={2}
                className="flex-1 rounded-xl2 bg-black/25 border border-qcAccent/30 text-white text-sm p-3 outline-none shadow-soft"
                placeholder={`Ask QC Buddy anything… (ex: "How many cuisine tags can I add for Jordan onboarding?")`}
              />
              <button onClick={onSend} className="h-[40px] px-4 rounded-xl2 bg-qcAccent text-black font-semibold shadow-soft">Send</button>
            </div>

            <FileUploadBox
              market={market}
              onResults={(data)=>{ setBatchResults(data); setShowBatchPanel(true); }}
              apiBase={API_BASE}
            />
            <TagSuggestor market={market} apiBase={API_BASE} />
          </div>
        </div>
      </div>

      {showSources && (
        <div className="w-[360px] border-l border-qcAccent/20 bg-[#0f1215] hidden md:block">
          <SourcePanel sources={sources} />
        </div>
      )}

      <BatchResultsPanel open={showBatchPanel} results={batchResults} onClose={()=>setShowBatchPanel(false)} />
    </div>
  );
}
