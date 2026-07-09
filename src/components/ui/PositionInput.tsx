"use client";

import { useMemo, useState } from "react";
import type { Player, Position } from "@/lib/game-engine/types";
import { clsx } from "@/lib/clsx";

export function PositionInput({
  position,
  player,
  candidates,
  onSelect,
  onClear,
}: {
  position: Position;
  player: Player | null;
  candidates: Player[];
  onSelect: (player: Player) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    if (!query.trim()) return candidates.slice(0, 6);
    const q = query.toLowerCase();
    return candidates.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, candidates]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5">
        <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue text-badge font-bold uppercase text-white">
          {position}
        </span>

        {player ? (
          <button
            type="button"
            onClick={onClear}
            className="flex flex-1 items-center justify-between px-2 text-left text-black"
          >
            <span className="truncate font-bold uppercase">{player.name}</span>
            <span className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-black text-white">
              {player.overall}
            </span>
          </button>
        ) : (
          <input
            type="text"
            value={query}
            placeholder="Search player..."
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            className="flex-1 bg-transparent px-2 text-black placeholder:text-gray-mid focus:outline-none"
          />
        )}
      </div>

      {open && !player && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg">
          {matches.length === 0 && (
            <li className="px-4 py-2 text-sm text-gray-mid">No players found</li>
          )}
          {matches.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                onMouseDown={() => {
                  onSelect(candidate);
                  setQuery("");
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between px-4 py-2 text-left text-black hover:bg-brand-blue hover:text-white",
                )}
              >
                <span className="truncate">{candidate.name}</span>
                <span className="ml-2 text-xs font-bold">{candidate.overall}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
