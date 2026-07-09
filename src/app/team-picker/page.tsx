"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { PositionInput } from "@/components/ui/PositionInput";
import { Modal } from "@/components/ui/Modal";
import { Pitch } from "@/components/team-picker/Pitch";
import { useSquadStore, SQUAD_SLOTS } from "@/store/squadStore";
import { useAuth } from "@/providers/AuthProvider";
import { getPlayerPool } from "@/lib/players";
import type { Player } from "@/lib/game-engine/types";

function TeamPickerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { squad, teamName, setTeamName, setSlot, clearSlot, isComplete } = useSquadStore();

  const [players, setPlayers] = useState<Player[]>([]);
  const [tutorialOpen, setTutorialOpen] = useState(searchParams.get("tutorial") === "1");

  useEffect(() => {
    getPlayerPool().then(setPlayers);
  }, []);

  const selectedIds = useMemo(
    () => new Set(squad.filter((p): p is Player => p !== null).map((p) => p.id)),
    [squad],
  );

  function handlePlay() {
    if (!isComplete()) return;
    if (authLoading) return;
    router.push(user ? "/match/loading" : "/auth");
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-brand-blue px-6 py-10">
      <Logo size="md" />

      <div className="mt-8 w-full max-w-5xl">
        <Pitch />

        <div className="mt-4 flex items-center justify-between text-badge font-bold uppercase">
          <span className="text-brand-yellow">Home</span>
          <span className="text-brand-red">Away</span>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
          <div className="order-2 sm:order-1">
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter Team Name"
              className="mb-4 w-full rounded-full border-2 border-brand-yellow bg-transparent px-5 py-3 text-center font-display text-button font-black italic uppercase text-white placeholder:text-white/60 focus:outline-none"
            />
            <p className="mb-2 text-center text-badge font-bold uppercase text-white">
              Select Your Team
            </p>
            <div className="space-y-3">
              {SQUAD_SLOTS.map((position, i) => (
                <PositionInput
                  key={i}
                  position={position}
                  player={squad[i]}
                  onSelect={(player) => setSlot(i, player)}
                  onClear={() => clearSlot(i)}
                  candidates={players.filter(
                    (p) => p.position === position && !selectedIds.has(p.id),
                  )}
                />
              ))}
            </div>
          </div>

          <div className="order-1 flex justify-center sm:order-2 sm:pt-16">
            <div className="w-full max-w-[220px]">
              <PillButton onClick={handlePlay} disabled={!isComplete()}>
                Play
              </PillButton>
            </div>
          </div>

          <div className="order-3">
            <div className="mb-4 w-full rounded-full border-2 border-brand-red bg-transparent px-5 py-3 text-center font-display text-button font-black italic uppercase text-white/50">
              Opponent
            </div>
            <p className="mb-2 text-center text-badge font-bold uppercase text-white">
              Selected Automatically
            </p>
            <div className="space-y-3">
              {SQUAD_SLOTS.map((position, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full bg-white/20 px-2 py-1.5"
                >
                  <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-full bg-brand-red text-badge font-bold uppercase text-white">
                    {position}
                  </span>
                  <span className="flex-1 px-2 text-white/60">Revealed at kickoff</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal open={tutorialOpen} onClose={() => setTutorialOpen(false)} className="text-left text-white">
        <h2 className="font-display text-title font-black italic uppercase text-brand-yellow">
          How to Play
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-white">
          <li>Enter a team name and pick five players — GK, DEF, MID, MID, and ST.</li>
          <li>Tap Play. If you&apos;re not signed in yet, we&apos;ll ask you to sign in first.</li>
          <li>Watch the live match commentary unfold, or skip straight to the final result.</li>
          <li>
            When the match ends you&apos;ll see the full summary with stats and Player of the
            Match — have fun!
          </li>
        </ol>
      </Modal>
    </main>
  );
}

export default function TeamPickerPage() {
  return (
    <Suspense fallback={null}>
      <TeamPickerContent />
    </Suspense>
  );
}
