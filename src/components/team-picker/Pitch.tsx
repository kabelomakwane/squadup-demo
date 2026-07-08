import { clsx } from "@/lib/clsx";

const HOME_MARKERS = [
  { label: "GK", top: "50%", left: "8%" },
  { label: "DEF", top: "50%", left: "24%" },
  { label: "MID", top: "22%", left: "40%" },
  { label: "MID", top: "78%", left: "40%" },
  { label: "ST", top: "50%", left: "45%" },
];

const AWAY_MARKERS = [
  { label: "GK", top: "50%", left: "92%" },
  { label: "DEF", top: "50%", left: "76%" },
  { label: "MID", top: "22%", left: "60%" },
  { label: "MID", top: "78%", left: "60%" },
  { label: "ST", top: "50%", left: "55%" },
];

function Marker({ label }: { label: string }) {
  return (
    <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-black text-brand-blue">
        {label}
      </span>
      <span className="text-[10px] text-white/70">Player</span>
    </div>
  );
}

export function Pitch({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-white/30 bg-brand-blue",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      {[...HOME_MARKERS, ...AWAY_MARKERS].map((marker, i) => (
        <div key={i} style={{ top: marker.top, left: marker.left }} className="absolute">
          <Marker label={marker.label} />
        </div>
      ))}
    </div>
  );
}
