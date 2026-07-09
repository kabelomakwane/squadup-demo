"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";

export default function MatchEndPage() {
  const router = useRouter();
  const { result, resultId } = useMatchStore();
  const mode = useSquadStore((s) => s.mode);
  const home = useSquadStore((s) => s.home);
  const away = useSquadStore((s) => s.away);

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

  const homeName = home.name || "Your Squad";
  const awayName = mode === "head-to-head" ? away.name || "Opponent" : "Opponent";

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-brand-blue to-brand-blue-bright px-6 py-16">
      <Logo size="md" />

      <div className="flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="shrink-0 font-display text-[4rem] font-black italic uppercase leading-none text-white sm:text-[6rem] lg:text-[8rem]">
            Home
          </span>
          <span className="hidden max-w-xs truncate rounded-full border-2 border-brand-yellow px-6 py-3 font-display text-lg font-black italic uppercase text-white sm:block">
            {homeName}
          </span>
        </div>
        <span className="shrink-0 font-display text-[5rem] font-black italic leading-none text-white sm:text-[7rem] lg:text-[9rem]">
          {result.userScore}
        </span>
      </div>

      <div className="flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="shrink-0 font-display text-[4rem] font-black italic uppercase leading-none text-white sm:text-[6rem] lg:text-[8rem]">
            Away
          </span>
          <span className="hidden max-w-xs truncate rounded-full border-2 border-brand-red px-6 py-3 font-display text-lg font-black italic uppercase text-white sm:block">
            {awayName}
          </span>
        </div>
        <span className="shrink-0 font-display text-[5rem] font-black italic leading-none text-white sm:text-[7rem] lg:text-[9rem]">
          {result.opponentScore}
        </span>
      </div>

      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white">Final Score</p>
    </main>
  );
}
