"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { BigWordBackdrop } from "@/components/ui/BigWordBackdrop";
import { useSquadStore } from "@/store/squadStore";
import { useMatchStore } from "@/store/matchStore";
import { useAuth } from "@/providers/AuthProvider";
import { getPlayerPool } from "@/lib/players";
import { simulateMatch } from "@/lib/game-engine/simulate";
import { createClient } from "@/lib/supabase/client";
import type { Player } from "@/lib/game-engine/types";

export default function MatchLoadingPage() {
  const router = useRouter();
  const { squad, teamName, isComplete } = useSquadStore();
  const { setResult } = useMatchStore();
  const { user } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!isComplete()) {
      router.replace("/team-picker");
      return;
    }

    (async () => {
      const pool = await getPlayerPool();
      const userSquad = squad as Player[];
      const result = simulateMatch(userSquad, pool);

      let resultId: string | null = null;
      if (user) {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("match_results")
            .insert({
              user_id: user.id,
              squad_player_ids: userSquad.map((p) => p.id),
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
  }, [isComplete, router, setResult, squad, teamName, user]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-bright px-6 py-16 text-center">
      <BigWordBackdrop />
      <div className="relative z-10">
        <Logo size="lg" />
        <p className="mx-auto mt-10 max-w-xl text-sm font-bold text-white">
          Players are out on the pitch warming up. Fans are in full voice, commentators are ready
          — kick-off is just moments away.
        </p>
      </div>
    </main>
  );
}
