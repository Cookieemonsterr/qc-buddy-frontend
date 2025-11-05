export default function ChatMessage({ role, text, buddyMood }) {
  const isBuddy = role === "buddy";

  // pick avatar face
  let face = "😼";
  if (buddyMood === "confused") face = "😳";
  if (buddyMood === "happy") face = "😼";
  if (buddyMood === "warn") face = "😠";
  if (buddyMood === "pass") face = "😌";

  return (
    <div className={`flex gap-3 ${isBuddy ? "justify-start" : "justify-end"}`}>
      {isBuddy && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-qcAccentSoft border border-qcAccent flex items-center justify-center shadow-soft text-qcAccent text-xs font-bold">
            {face}
          </div>
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-bubble px-4 py-3 text-sm leading-relaxed shadow-soft whitespace-pre-wrap ${
          isBuddy
            ? "bg-qcBubble text-white border border-qcAccent/30"
            : "bg-qcAccent text-black font-medium"
        }`}
      >
        {text}
      </div>

      {!isBuddy && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-qcAccent text-black flex items-center justify-center font-bold shadow-soft">
            You
          </div>
        </div>
      )}
    </div>
  );
}
