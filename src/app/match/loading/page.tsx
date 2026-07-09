"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { BigWordBackdrop } from "@/components/ui/BigWordBackdrop";
import { useSquadStore } from "@/store/squadStore";
import { useMatchStore } from "@/store/matchStore";
import { useAuth } from "@/providers/AuthProvider";
import { getPlayerPool } from "@/lib/players";
import { simulateMatch, pickOpponentSquad } from "@/lib/game-engine/simulate";
import { createClient } from "@/lib/supabase/client";
import type { Player } from "@/lib/game-engine/types";

export default function MatchLoadingPage() {
  const router = useRouter();
  const mode = useSquadStore((s) => s.mode);
  const home = useSquadStore((s) => s.home);
  const away = useSquadStore((s) => s.away);
  const isReadyToPlay = useSquadStore((s) => s.isReadyToPlay);
  const { setResult } = useMatchStore();
  const { user } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    if (!isReadyToPlay()) {
      router.replace("/team-picker");
      return;
    }
    started.current = true;

    (async () => {
      const state = useSquadStore.getState();
      const homeSquad = state.home.squad as Player[];

      let opponentSquad: Player[];
      if (state.mode === "head-to-head") {
        opponentSquad = state.away.squad as Player[];
      } else {
        const pool = await getPlayerPool();
        opponentSquad = pickOpponentSquad(homeSquad, pool);
      }

      const result = simulateMatch(homeSquad, opponentSquad);

      let resultId: string | null = null;
      if (user) {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("match_results")
            .insert({
              user_id: user.id,
              squad_player_ids: homeSquad.map((p) => p.id),
              opponent_snapshot: result.opponent,
              user_score: result.userScore,
              opponent_score: result.opponentScore,
              commentary_log: result.events,
              stats: result.stats,
              player_of_match: result.playerOfMatch,
            })
            .select("id")
            .single();
          resultId = data?.id ?? null;
        } catch {
          resultId = null;
        }
      }

      setResult(result, resultId);

      setTimeout(() => router.push("/match/live"), 1600);
    })();
  }, [isReadyToPlay, router, setResult, user, home, away]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-bright px-6 py-16 text-center">
      <BigWordBackdrop />
      <div className="relative z-10">
        <Logo size="lg" />
        <div className="mt-6 flex items-center justify-center gap-4 font-display text-title font-black italic uppercase text-white">
          <span>{home.name || "Home"}</span>
          <span className="text-brand-yellow">vs</span>
          <span>{mode === "head-to-head" ? away.name || "Away" : "Opponent"}</span>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-sm font-bold text-white">
          Players are out on the pitch warming up. Fans are in full voice, commentators are ready
          — kick-off is just moments away.
        </p>
      </div>
    </main>
  );
}
