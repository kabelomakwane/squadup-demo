"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ui/ScoreBug";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";
import type { MatchEvent } from "@/lib/game-engine/types";

const TOTAL_MINUTES = 30;
const TOTAL_MS = 60_000;

function cardTeam(event: MatchEvent): "user" | "opponent" | "default" {
  if (event.type !== "goal") return "default";
  return event.team === "user" ? "user" : "opponent";
}

export default function MatchLivePage() {
  const router = useRouter();
  const { result } = useMatchStore();
  const { teamName } = useSquadStore();

  const [visibleCount, setVisibleCount] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!result) {
      router.replace("/team-picker");
      return;
    }

    const scheduled = result.events.map((event, index) => {
      const delay = (event.minuteInGame / TOTAL_MINUTES) * TOTAL_MS;
      return setTimeout(() => setVisibleCount((c) => Math.max(c, index + 1)), delay);
    });
    timeouts.current = scheduled;

    const clockInterval = setInterval(() => setElapsedMs((t) => t + 250), 250);

    const advance = setTimeout(() => router.push("/match/end"), TOTAL_MS + 800);
    advanceTimeout.current = advance;

    return () => {
      scheduled.forEach(clearTimeout);
      clearInterval(clockInterval);
      clearTimeout(advance);
    };
  }, [result, router]);

  const visibleEvents = useMemo(
    () => (result ? result.events.slice(0, visibleCount) : []),
    [result, visibleCount],
  );

  const runningScore = useMemo(() => {
    let user = 0;
    let opponent = 0;
    for (const event of visibleEvents) {
      if (event.type === "goal") {
        if (event.team === "user") user += 1;
        else opponent += 1;
      }
    }
    return { user, opponent };
  }, [visibleEvents]);

  if (!result) return null;

  const gameMinute = Math.min(TOTAL_MINUTES, Math.floor((elapsedMs / TOTAL_MS) * TOTAL_MINUTES));
  const clock = gameMinute >= TOTAL_MINUTES ? "FT" : `${gameMinute}'`;

  function skipToEnd() {
    timeouts.current.forEach(clearTimeout);
    if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    router.push("/match/end");
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-brand-blue px-6 py-10">
      <ScoreBug
        homeName={teamName || "HOME"}
        awayName="OPPONENT"
        homeScore={runningScore.user}
        awayScore={runningScore.opponent}
        clock={clock}
      />

      <div className="mt-6 w-full max-w-md">
        <PillButton onClick={skipToEnd}>Skip to Final Result</PillButton>
      </div>

      <div className="mt-8 w-full max-w-2xl space-y-3 pb-10">
        {visibleEvents.map((event, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-10 shrink-0 pt-3 text-right text-xs font-bold text-white/70">
              {event.minuteInGame}&apos;
            </span>
            <Card team={cardTeam(event)} className="flex-1">
              {event.type === "goal" ? (
                <>
                  <p className="font-display text-lg font-black italic uppercase">
                    Goooooooooooal!
                  </p>
                  <p className="mt-1 text-sm">{event.text}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold">
                    {event.actingPlayer && <span>⚽ {event.actingPlayer}</span>}
                    {event.secondaryPlayer && <span>👟 {event.secondaryPlayer}</span>}
                  </div>
                </>
              ) : (
                <p className="text-sm">{event.text}</p>
              )}
            </Card>
          </div>
        ))}
      </div>
    </main>
  );
}
