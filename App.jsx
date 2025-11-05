// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/ChatMessage.jsx";
import SourcePanel from "./components/SourcePanel.jsx";
import FileUploadBox from "./components/FileUploadBox.jsx";
import BatchResultsPanel from "./components/BatchResultsPanel.jsx";
import TagSuggestor from "./components/TagSuggestor.jsx";

export default function App() {
  // --- state ---
  const [market, setMarket] = useState("AUTO"); // "AE" | "JO" | "AUTO"
  const [messages, setMessages] = useState([
    {
      role: "buddy",
      buddyMood: "happy",
      text:
        "I’m your QC Buddy 😼\n" +
        "Ask me rules, paste item names/descriptions for a quick check, or scroll down to run a Bulk QC on a whole CSV. " +
        "I’ll also suggest cuisine tags from your menu.\n\n" +
        "Tip: “is this correct for item name: banana pancake”",
      sources: [],
    },
  ]);
  const [sources, setSources] = useState([]);
  const [showSources, setShowSources] = useState(true);

  // batch QC panel
  const [batchResults, setBatchResults] = useState(null);
  const [showBatchPanel, setShowBatchPanel] = useState(false);

  const inputRef = useRef(null);

  // --- helpers ---
  async function sendToBackendAsk(msg, marketValue) {
    const res = await fetch("http://localhost:3001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, market: marketValue }),
    });
    return res.json();
  }

  async function onSend() {
    const val = inputRef.current?.value ?? "";
    const text = val.trim();
    if (!text) return;

    // push user bubble
    setMessages((prev) => [...prev, { role: "user", text }]);
    inputRef.current.value = "";

    try {
      const data = await sendToBackendAsk(text, market);
      setSources(data.sources || []);
      setMessages((prev) => [
        ...prev,
        {
          role: "buddy",
          text: data.answer || "…",
          buddyMood: data.buddyMood || "happy",
          sources: data.sources || [],
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "buddy",
          buddyMood: "confused",
          text:
            "I couldn’t reach the backend 😵‍💫\n" +
            "Make sure it’s running at http://localhost:3001",
          sources: [],
        },
      ]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-[#0d0f11] text-white flex">
      {/* main column */}
      <div className="flex-1 max-w-[1024px] mx-auto flex flex-col">
        {/* header */}
        <header className="sticky top-0 z-10 bg-[#0d0f11]/85 backdrop-blur border-b border-qcAccent/20">
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-qcAccent text-black flex items-center justify-center font-bold shadow-soft">
                Q
              </div>
              <div>
                <div className="text-sm font-semibold">QC Buddy</div>
                <div className="text-[11px] text-white/60">
                  Your onboarding + tagging + writing brain.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/60 mr-1">MARKET:</span>
              <button
                onClick={() => setMarket("AUTO")}
                className={`px-2 py-1 text-[11px] rounded-lg border ${
                  market === "AUTO"
                    ? "bg-qcAccent text-black border-qcAccent"
                    : "border-qcAccent/30 text-white/80"
                }`}
              >
                AUTO
              </button>
              <button
                onClick={() => setMarket("AE")}
                className={`px-2 py-1 text-[11px] rounded-lg border ${
                  market === "AE"
                    ? "bg-qcAccent text-black border-qcAccent"
                    : "border-qcAccent/30 text-white/80"
                }`}
              >
                AE
              </button>
              <button
                onClick={() => setMarket("JO")}
                className={`px-2 py-1 text-[11px] rounded-lg border ${
                  market === "JO"
                    ? "bg-qcAccent text-black border-qcAccent"
                    : "border-qcAccent/30 text-white/80"
                }`}
              >
                JO
              </button>

              <button
                onClick={() => setShowSources((s) => !s)}
                className="ml-3 px-2 py-1 text-[11px] rounded-lg border border-qcAccent/30 text-white/80"
                title="Toggle sources"
              >
                {showSources ? "Hide sources" : "Show sources"}
              </button>
            </div>
          </div>
        </header>

        {/* chat area */}
        <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
          {messages.map((m, i) => (
            <ChatMessage
              key={i}
              role={m.role === "buddy" ? "buddy" : "user"}
              text={m.text}
              buddyMood={m.buddyMood}
            />
          ))}
        </div>

        {/* input + helpers */}
        <div className="border-t border-qcAccent/20 bg-qcPanel">
          <div className="px-5 py-4 space-y-4">
            {/* input */}
            <div className="flex items-end gap-3">
              <textarea
                ref={inputRef}
                onKeyDown={handleKeyDown}
                rows={2}
                className="flex-1 rounded-xl2 bg-black/25 border border-qcAccent/30 text-white text-sm p-3 outline-none shadow-soft"
                placeholder={`Ask QC Buddy anything… (ex: "How many cuisine tags can I add for Jordan onboarding?")`}
              />
              <button
                onClick={onSend}
                className="h-[40px] px-4 rounded-xl2 bg-qcAccent text-black font-semibold shadow-soft"
              >
                Send
              </button>
            </div>

            {/* helpers */}
            <FileUploadBox
              market={market}
              onResults={(data) => {
                setBatchResults(data);
                setShowBatchPanel(true);
              }}
            />
            <TagSuggestor market={market} />
          </div>
        </div>
      </div>

      {/* right column: sources */}
      {showSources && (
        <div className="w-[360px] border-l border-qcAccent/20 bg-[#0f1215] hidden md:block">
          <SourcePanel sources={sources} />
        </div>
      )}

      {/* drawer: batch qc results */}
      <BatchResultsPanel
        open={showBatchPanel}
        results={batchResults}
        onClose={() => setShowBatchPanel(false)}
      />
    </div>
  );
}
