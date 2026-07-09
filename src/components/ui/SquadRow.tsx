import type { Player } from "@/lib/game-engine/types";

export function SquadRow({ player, marks }: { player: Player; marks?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5">
      <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-badge font-bold uppercase text-white">
        {player.position}
      </span>
      <span className="flex-1 truncate px-2 font-bold uppercase text-black">{player.name}</span>
      {marks && <span className="shrink-0 text-sm">{marks}</span>}
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-black text-white">
        {player.overall}
      </span>
    </div>
  );
}
