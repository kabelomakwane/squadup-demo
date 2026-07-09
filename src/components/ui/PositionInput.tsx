"use client";

import { useMemo, useState } from "react";
import type { Player, Position } from "@/lib/game-engine/types";
import { clsx } from "@/lib/clsx";

const DEFAULT_CUSTOM_RATING = 65;

export function makeCustomPlayer(name: string, position: Position): Player {
  return {
    id: `custom-${position}-${name.trim().toLowerCase()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    position,
    overall: DEFAULT_CUSTOM_RATING,
    pace: DEFAULT_CUSTOM_RATING,
    shooting: DEFAULT_CUSTOM_RATING,
    passing: DEFAULT_CUSTOM_RATING,
    defending: DEFAULT_CUSTOM_RATING,
  };
}

export function PositionInput({
  id,
  position,
  player,
  candidates,
  onSelect,
  onClear,
}: {
  id?: string;
  position: Position;
  player: Player | null;
  candidates: Player[];
  onSelect: (player: Player, custom: boolean) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    if (!query.trim()) return candidates.slice(0, 6);
    const q = query.toLowerCase();
    return candidates.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, candidates]);

  const exactMatch = useMemo(
    () => candidates.find((p) => p.name.toLowerCase() === query.trim().toLowerCase()),
    [candidates, query],
  );

  function confirmSelection() {
    const trimmed = query.trim();
    if (!trimmed) return;
    if (exactMatch) {
      onSelect(exactMatch, false);
    } else {
      onSelect(makeCustomPlayer(trimmed, position), true);
    }
    setQuery("");
    setOpen(false);
  }

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
            id={id}
            type="text"
            value={query}
            placeholder="Search a player..."
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmSelection();
              }
              if (e.key === "Escape") {
                setQuery("");
                setOpen(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="flex-1 bg-transparent px-2 text-black placeholder:text-gray-mid focus:outline-none"
          />
        )}
      </div>

      {open && !player && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg bg-white shadow-lg">
          {matches.length === 0 && !query.trim() && (
            <li className="px-4 py-2 text-sm text-gray-mid">No players found</li>
          )}
          {matches.map((candidate) => (
            <li key={candidate.id}>
              <button
                type="button"
                onMouseDown={() => {
                  onSelect(candidate, false);
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
          {query.trim() && !exactMatch && (
            <li>
              <button
                type="button"
                onMouseDown={() => {
                  onSelect(makeCustomPlayer(query, position), true);
                  setQuery("");
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between border-t border-gray-light/40 px-4 py-2 text-left text-black hover:bg-brand-blue hover:text-white"
              >
                <span className="truncate">Use &ldquo;{query.trim()}&rdquo;</span>
                <span className="ml-2 text-xs font-bold">{DEFAULT_CUSTOM_RATING}</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
