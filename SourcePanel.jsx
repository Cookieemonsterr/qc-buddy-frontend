export default function SourcePanel({ sources, open }) {
  return (
    <div
      className={`transition-all duration-200 bg-qcPanel border-l border-qcAccent/20 w-72 flex-shrink-0 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      } flex flex-col`}
    >
      <div className="p-4 border-b border-qcAccent/20 text-qcAccent text-sm font-semibold">
        Sources Buddy Used
      </div>

      <div className="p-4 text-xs text-white/80 overflow-y-auto flex-1 space-y-4">
        {(!sources || sources.length === 0) && (
          <div className="text-white/40 text-[11px] italic">
            No sources for this answer.
          </div>
        )}

        {sources &&
          sources.map((s, idx) => (
            <div
              key={idx}
              className="rounded-xl2 bg-qcBubble border border-qcAccent/20 p-3"
            >
              <div className="text-qcAccent text-[11px] font-semibold mb-1">
                {s.source}
              </div>
              <div className="text-white text-[11px] leading-relaxed">
                Market: {s.market}
                <br />
                Topic: {s.topic}
              </div>
            </div>
          ))}
      </div>

      <div className="p-4 border-t border-qcAccent/20 text-[11px] text-white/50">
        Buddy always cites SOP sections so you can defend your work 🫡
      </div>
    </div>
  );
}
