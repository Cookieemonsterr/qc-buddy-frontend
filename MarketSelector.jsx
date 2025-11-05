export default function MarketSelector({ market, setMarket }) {
  const opts = ["AUTO", "AE", "JO"];
  return (
    <div className="flex items-center gap-2 text-[11px] text-white/70">
      <span className="text-white/40 uppercase tracking-wide">Market:</span>
      {opts.map((m) => (
        <button
          key={m}
          onClick={() => setMarket(m)}
          className={`px-2 py-1 rounded-lg border text-[11px] ${
            m === market
              ? "bg-qcAccent text-black border-qcAccent"
              : "bg-transparent border-white/20 text-white/70 hover:text-white hover:border-white/40"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
