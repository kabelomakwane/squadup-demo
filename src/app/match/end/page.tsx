"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ui/ScoreBug";
import { BigWordBackdrop } from "@/components/ui/BigWordBackdrop";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";

export default function MatchEndPage() {
  const router = useRouter();
  const { result, resultId } = useMatchStore();
  const { teamName } = useSquadStore();

  useEffect(() => {
    if (!result) {
      router.replace("/team-picker");
      return;
    }
    const t = setTimeout(() => {
      const query = resultId ? `?id=${resultId}` : "";
      router.push(`/match/summary${query}`);
    }, 3200);
    return () => clearTimeout(t);
  }, [result, resultId, router]);

  if (!result) return null;

  const home = teamName || "Your Squad";
  const headline =
    result.userScore === result.opponentScore
      ? "It ends all square in a hard-fought draw!"
      : result.userScore > result.opponentScore
        ? `${home} takes the victory in an absolute scorcher!`
        : "The opponent snatches the win — back to the drawing board!";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-bright px-6 py-16 text-center">
      <BigWordBackdrop />
      <div className="relative z-10 flex flex-col items-center gap-10">
        <ScoreBug
          homeName={home}
          awayName="Opponent"
          homeScore={result.userScore}
          awayScore={result.opponentScore}
          clock="FT"
        />
        <h1 className="max-w-2xl font-display text-title font-black italic uppercase text-white sm:text-headline-sm">
          {headline}
        </h1>
      </div>
    </main>
  );
}
