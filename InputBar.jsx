export default function InputBar({ value, setValue, onSend, disabled }) {
  return (
    <div className="flex gap-3 items-start">
      <textarea
        className="flex-1 rounded-xl2 bg-qcBubble border border-qcAccent/30 text-sm text-white p-3 leading-relaxed resize-none h-20 shadow-soft outline-none focus:ring-2 focus:ring-qcAccent/40"
        placeholder="Ask QC Buddy anything… (ex: “How many cuisine tags can I add for Jordan onboarding?”)"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="rounded-xl2 bg-qcAccent text-black font-semibold text-sm px-4 py-3 shadow-soft disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
}
