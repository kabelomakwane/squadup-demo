const LINES = [
  "FIVE-A-SIDE • ONE V ONE • FOOTBALL • COMPETE",
  "THIRTY MINUTES • ONE WINNER • GAME TIME",
];

export function GhostMarquee({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden whitespace-nowrap font-display text-6xl font-black italic uppercase leading-tight text-white/10 ${className ?? ""}`}
    >
      {LINES.map((line) => (
        <div key={line}>
          {line} &nbsp; {line} &nbsp; {line}
        </div>
      ))}
    </div>
  );
}
