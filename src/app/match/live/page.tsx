"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ui/ScoreBug";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";
import { scheduleEvents, matchClockLabel, FULL_TIME_MS, type PacedEvent } from "@/lib/game-engine/pacing";

function cardTeam(event: PacedEvent): "user" | "opponent" | "default" {
  if (event.type !== "goal") return "default";
  return event.team === "user" ? "user" : "opponent";
}

function EventCard({ event, featured }: { event: PacedEvent; featured: boolean }) {
  return (
    <Card team={cardTeam(event)} className={featured ? "animate-event-in" : "opacity-70"}>
      {event.type === "goal" ? (
        <>
          <p className={featured ? "font-display text-xl font-black italic uppercase" : "font-display text-sm font-black italic uppercase"}>
            Goooooooooooal!
          </p>
          <p className={featured ? "mt-1 text-sm" : "mt-1 text-xs"}>{event.text}</p>
          {featured && (
            <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold">
              {event.actingPlayer && <span>⚽ {event.actingPlayer}</span>}
              {event.secondaryPlayer && <span>👟 {event.secondaryPlayer}</span>}
            </div>
          )}
        </>
      ) : (
        <p className={featured ? "text-base" : "text-xs"}>{event.text}</p>
      )}
    </Card>
  );
}

export default function MatchLivePage() {
  const router = useRouter();
  const { result } = useMatchStore();
  const mode = useSquadStore((s) => s.mode);
  const home = useSquadStore((s) => s.home);
  const away = useSquadStore((s) => s.away);

  const pacedEvents = useMemo(() => (result ? scheduleEvents(result.events) : []), [result]);

  const [elapsedMs, setElapsedMs] = useState(0);
  const [paused, setPaused] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!result) {
      router.replace("/team-picker");
    }
  }, [result, router]);

  useEffect(() => {
    if (!result || paused) return;

    startedAtRef.current = Date.now() - elapsedMs;
    tickRef.current = setInterval(() => {
      const next = Math.min(FULL_TIME_MS, Date.now() - (startedAtRef.current ?? Date.now()));
      setElapsedMs(next);
      if (next >= FULL_TIME_MS) {
        if (tickRef.current) clearInterval(tickRef.current);
        router.push("/match/end");
      }
    }, 100);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, paused]);

  const visibleEvents = useMemo(
    () => pacedEvents.filter((event) => event.atMs <= elapsedMs),
    [pacedEvents, elapsedMs],
  );
  const featured = visibleEvents[visibleEvents.length - 1];
  const history = visibleEvents.slice(0, -1).reverse().slice(0, 4);

  let runningUserScore = 0;
  let runningOpponentScore = 0;
  for (const event of visibleEvents) {
    if (event.type === "goal") {
      if (event.team === "user") runningUserScore += 1;
      else runningOpponentScore += 1;
    }
  }

  if (!result) return null;

  const awayName = mode === "head-to-head" ? away.name || "Away" : "Opponent";

  return (
    <main className="flex flex-1 flex-col items-center bg-brand-blue px-6 py-10">
      <ScoreBug
        homeName={home.name || "Home"}
        awayName={awayName}
        homeScore={runningUserScore}
        awayScore={runningOpponentScore}
        clock={matchClockLabel(elapsedMs)}
      />

      <div className="mt-6 flex w-full max-w-md gap-3">
        <PillButton variant="outline" onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </PillButton>
        <PillButton onClick={() => router.push("/match/fast-forward")}>Skip to Final Result</PillButton>
      </div>

      <div className="mt-8 w-full max-w-2xl space-y-3 pb-10">
        {featured && (
          <div className="flex items-start gap-3">
            <span className="w-10 shrink-0 pt-3 text-right text-xs font-bold text-white/70">
              {featured.minuteInGame}&apos;
            </span>
            <div className="flex-1">
              <EventCard event={featured} featured />
            </div>
          </div>
        )}
        {history.length > 0 && (
          <div className="space-y-2">
            {history.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-10 shrink-0 pt-2 text-right text-[10px] font-bold text-white/50">
                  {event.minuteInGame}&apos;
                </span>
                <div className="flex-1">
                  <EventCard event={event} featured={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
