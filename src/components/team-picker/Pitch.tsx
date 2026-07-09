import { clsx } from "@/lib/clsx";
import type { Player } from "@/lib/game-engine/types";
import { SQUAD_SLOTS } from "@/store/squadStore";

const HOME_COORDS = [
  { top: "50%", left: "8%" },
  { top: "50%", left: "24%" },
  { top: "22%", left: "40%" },
  { top: "78%", left: "40%" },
  { top: "50%", left: "45%" },
];

const AWAY_COORDS = [
  { top: "50%", left: "92%" },
  { top: "50%", left: "76%" },
  { top: "22%", left: "60%" },
  { top: "78%", left: "60%" },
  { top: "50%", left: "55%" },
];

function lastName(name: string): string {
  const parts = name.trim().split(" ");
  return parts[parts.length - 1] || name;
}

function Marker({
  label,
  player,
  clickable,
  onClick,
}: {
  label: string;
  player: Player | null;
  clickable: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black",
          player ? "bg-brand-yellow text-brand-blue" : "bg-white text-brand-blue",
        )}
      >
        {label}
      </span>
      <span className="max-w-[70px] truncate text-[10px] text-white/70">
        {player ? lastName(player.name) : "Select"}
      </span>
    </>
  );

  if (!clickable) {
    return <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
    >
      {content}
    </button>
  );
}

export function Pitch({
  homeSquad,
  awaySquad,
  editableAway = false,
  onSlotClick,
  className,
}: {
  homeSquad: (Player | null)[];
  awaySquad: (Player | null)[];
  editableAway?: boolean;
  onSlotClick?: (side: "home" | "away", index: number) => void;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-white/30 bg-brand-blue",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      {HOME_COORDS.map((coord, i) => (
        <div key={`home-${i}`} style={coord} className="absolute">
          <Marker
            label={SQUAD_SLOTS[i]}
            player={homeSquad[i] ?? null}
            clickable
            onClick={() => onSlotClick?.("home", i)}
          />
        </div>
      ))}
      {AWAY_COORDS.map((coord, i) => (
        <div key={`away-${i}`} style={coord} className="absolute">
          <Marker
            label={SQUAD_SLOTS[i]}
            player={awaySquad[i] ?? null}
            clickable={editableAway}
            onClick={() => onSlotClick?.("away", i)}
          />
        </div>
      ))}
    </div>
  );
}
