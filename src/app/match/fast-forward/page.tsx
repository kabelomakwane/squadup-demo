"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ui/ScoreBug";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";

const DURATION_MS = 2200;

export default function FastForwardPage() {
  const router = useRouter();
  const { result } = useMatchStore();
  const mode = useSquadStore((s) => s.mode);
  const home = useSquadStore((s) => s.home);
  const away = useSquadStore((s) => s.away);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!result) {
      router.replace("/team-picker");
      return;
    }

    const started = Date.now();
    const tick = setInterval(() => {
      const raw = Math.min(1, (Date.now() - started) / DURATION_MS);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(eased);
      if (raw >= 1) {
        clearInterval(tick);
        router.push("/match/end");
      }
    }, 50);

    return () => clearInterval(tick);
  }, [result, router]);

  if (!result) return null;

  const awayName = mode === "head-to-head" ? away.name || "Away" : "Opponent";
  const homeScore = Math.round(result.userScore * progress);
  const awayScore = Math.round(result.opponentScore * progress);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-brand-blue px-6 py-16 text-center">
      <ScoreBug
        homeName={home.name || "Home"}
        awayName={awayName}
        homeScore={homeScore}
        awayScore={awayScore}
        clock={progress >= 1 ? "FT" : "..."}
      />

      <div className="h-2 w-full max-w-md overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-brand-red transition-[width]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div aria-hidden className="flex gap-2 text-2xl font-black text-white/40">
        {["»", "»", "»", "»", "»"].map((chevron, i) => (
          <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
            {chevron}
          </span>
        ))}
      </div>

      <div>
        <h1 className="font-display text-title font-black italic uppercase text-white">
          Racing to full-time
        </h1>
        <p className="mt-2 text-sm text-white/70">Compressing the drama. Keeping the goals.</p>
      </div>
    </main>
  );
}
