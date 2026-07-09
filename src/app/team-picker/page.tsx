"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { Modal } from "@/components/ui/Modal";
import { Pitch } from "@/components/team-picker/Pitch";
import { TeamPanel } from "@/components/team-picker/TeamPanel";
import { useSquadStore, SQUAD_SLOTS, type Side } from "@/store/squadStore";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { getPlayerPool } from "@/lib/players";
import type { Player } from "@/lib/game-engine/types";

function normalize(name: string) {
  return name.trim().toLowerCase();
}

function TeamPickerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, loading: authLoading } = useAuth();
  const showToast = useToast();
  const {
    mode,
    home,
    away,
    setMode,
    setTeamName,
    setSlot,
    clearSlot,
    clearTeam,
    randomiseTeam,
    isReadyToPlay,
  } = useSquadStore();

  const [players, setPlayers] = useState<Player[]>([]);
  const [tutorialOpen, setTutorialOpen] = useState(searchParams.get("tutorial") === "1");

  useEffect(() => {
    getPlayerPool().then(setPlayers);
  }, []);

  const isHeadToHead = mode === "head-to-head";

  const selectedIds = useMemo(() => {
    const ids = { home: new Set<string>(), away: new Set<string>() };
    home.squad.forEach((p) => p && ids.home.add(p.id));
    away.squad.forEach((p) => p && ids.away.add(p.id));
    return ids;
  }, [home.squad, away.squad]);

  function candidatesFor(side: Side, position: Player["position"]) {
    return players.filter((p) => p.position === position && !selectedIds[side].has(p.id));
  }

  function handleSelect(side: Side, index: number, player: Player, custom: boolean) {
    const team = side === "home" ? home : away;
    const duplicate = team.squad.some(
      (p, i) => i !== index && p && normalize(p.name) === normalize(player.name),
    );
    if (duplicate) {
      showToast(`${player.name} is already in this squad.`);
      return;
    }
    setSlot(side, index, player);
    if (custom) showToast(`Added "${player.name}" as a custom player.`);
  }

  function handlePitchClick(side: Side, index: number) {
    const team = side === "home" ? home : away;
    if (team.squad[index]) clearSlot(side, index);
    requestAnimationFrame(() => {
      document.getElementById(`slot-${side}-${index}`)?.focus();
    });
  }

  function handlePlay() {
    if (!isReadyToPlay()) return;
    if (isHeadToHead) {
      router.push("/match/loading");
      return;
    }
    if (authLoading) return;
    router.push(isSignedIn ? "/match/loading" : "/auth");
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-brand-blue px-6 py-10">
      <Logo size="md" />

      <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 text-xs font-bold uppercase">
        <button
          type="button"
          onClick={() => setMode("vs-ai")}
          className={`rounded-full px-4 py-2 transition-colors ${
            !isHeadToHead ? "bg-brand-red text-white" : "text-white/60"
          }`}
        >
          Vs AI
        </button>
        <button
          type="button"
          onClick={() => setMode("head-to-head")}
          className={`rounded-full px-4 py-2 transition-colors ${
            isHeadToHead ? "bg-brand-red text-white" : "text-white/60"
          }`}
        >
          Head-to-Head
        </button>
      </div>

      <div className="mt-6 w-full max-w-5xl">
        <Pitch
          homeSquad={home.squad}
          awaySquad={away.squad}
          editableAway={isHeadToHead}
          onSlotClick={handlePitchClick}
        />

        <div className="mt-4 flex items-center justify-between text-badge font-bold uppercase">
          <span className="text-brand-yellow">Home</span>
          <span className="text-brand-red">Away</span>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
          <div className="order-2 sm:order-1">
            <TeamPanel
              side="home"
              name={home.name}
              squad={home.squad}
              candidatesFor={(_index, position) => candidatesFor("home", position)}
              onNameChange={(value) => setTeamName("home", value)}
              onSelect={(index, player, custom) => handleSelect("home", index, player, custom)}
              onClear={(index) => clearSlot("home", index)}
              onRandomise={() => randomiseTeam("home", players)}
              onClearTeam={() => clearTeam("home")}
            />
          </div>

          <div className="order-1 flex justify-center sm:order-2 sm:pt-16">
            <div className="w-full max-w-[220px]">
              <PillButton onClick={handlePlay} disabled={!isReadyToPlay()}>
                Play
              </PillButton>
            </div>
          </div>

          <div className="order-3">
            {isHeadToHead ? (
              <TeamPanel
                side="away"
                name={away.name}
                squad={away.squad}
                candidatesFor={(_index, position) => candidatesFor("away", position)}
                onNameChange={(value) => setTeamName("away", value)}
                onSelect={(index, player, custom) => handleSelect("away", index, player, custom)}
                onClear={(index) => clearSlot("away", index)}
                onRandomise={() => randomiseTeam("away", players)}
                onClearTeam={() => clearTeam("away")}
              />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      <Modal open={tutorialOpen} onClose={() => setTutorialOpen(false)} className="text-left text-white">
        <h2 className="font-display text-title font-black italic uppercase text-brand-yellow">
          How to Play
        </h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-white">
          <li>
            Pick a mode: <strong>Vs AI</strong> (build one squad, sign in, play a simulated
            opponent) or <strong>Head-to-Head</strong> (build both squads locally, no sign-in
            needed).
          </li>
          <li>Enter a team name and pick five players — GK, DEF, MID, MID, and ST.</li>
          <li>Tap Play to watch the live match commentary, or skip straight to the final result.</li>
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
