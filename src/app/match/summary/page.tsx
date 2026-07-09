"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ScoreBug } from "@/components/ui/ScoreBug";
import { PillButton } from "@/components/ui/PillButton";
import { StatBar } from "@/components/ui/StatBar";
import { SquadRow } from "@/components/ui/SquadRow";
import { ShareModal } from "@/components/match/ShareModal";
import { useMatchStore } from "@/store/matchStore";
import { useSquadStore } from "@/store/squadStore";
import { createClient } from "@/lib/supabase/client";
import { computeContributions, contributionMarks } from "@/lib/game-engine/contributions";
import type { MatchResult, Player } from "@/lib/game-engine/types";

function recapBlurb(result: MatchResult, home: string, away: string): string {
  const winner =
    result.userScore === result.opponentScore ? null : result.userScore > result.opponentScore ? home : away;
  const possessionLeader =
    result.stats.possession.user >= result.stats.possession.opponent ? home : away;
  const potm = result.playerOfMatch.name;

  if (!winner) {
    return `A tightly contested draw — ${possessionLeader} dominated possession, but neither side could find a winner. ${potm} was the standout performer on the day.`;
  }

  return `${winner} controlled large spells of the match${possessionLeader === winner ? ", dominating possession throughout" : ""} and made it count on the scoreboard. ${potm} was the difference-maker, earning Player of the Match.`;
}

function MatchSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { result, reset: resetMatch } = useMatchStore();
  const mode = useSquadStore((s) => s.mode);
  const home = useSquadStore((s) => s.home);
  const away = useSquadStore((s) => s.away);
  const resetSquad = useSquadStore((s) => s.reset);

  const [remoteResult, setRemoteResult] = useState<MatchResult | null>(null);
  const [remoteSquad, setRemoteSquad] = useState<Player[] | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (result || !id) return;

    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("match_results")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setNotFound(true);
        return;
      }

      setRemoteResult({
        userScore: data.user_score,
        opponentScore: data.opponent_score,
        events: data.commentary_log,
        stats: data.stats,
        playerOfMatch: data.player_of_match,
        opponent: data.opponent_snapshot,
      });
      setRemoteSquad(data.squad_player_ids as Player[]);
    })();
  }, [id, result]);

  const activeResult = result ?? remoteResult;
  const activeSquad = result ? (home.squad as Player[]) : remoteSquad;

  const contributions = useMemo(
    () => (activeResult ? computeContributions(activeResult.events) : new Map()),
    [activeResult],
  );

  if (!activeResult || !activeSquad) {
    if (notFound) {
      return (
        <main className="flex flex-1 flex-col items-center justify-center bg-brand-blue px-6 py-16 text-center">
          <Logo size="md" />
          <p className="mt-8 text-white">This match result couldn&apos;t be found.</p>
          <div className="mt-6 w-full max-w-xs">
            <PillButton onClick={() => router.push("/team-picker")}>New Game</PillButton>
          </div>
        </main>
      );
    }
    return null;
  }

  const homeName = home.name || "Your Squad";
  const awayName = mode === "head-to-head" ? away.name || "Opponent" : "Opponent";
  const homeSquadOrdered = [...activeSquad].reverse();
  const awaySquadOrdered = [...activeResult.opponent].reverse();

  const headline =
    activeResult.userScore === activeResult.opponentScore
      ? "It ends all square in a hard-fought draw!"
      : activeResult.userScore > activeResult.opponentScore
        ? `${homeName} takes the victory in an absolute scorcher!`
        : `${awayName} snatches the win — back to the drawing board!`;

  function handleNewGame() {
    resetMatch();
    resetSquad();
    router.push("/team-picker");
  }

  return (
    <main className="flex flex-1 flex-col items-center bg-brand-blue px-6 py-10">
      <Logo size="md" />

      <div className="mt-8">
        <ScoreBug
          homeName={homeName}
          awayName={awayName}
          homeScore={activeResult.userScore}
          awayScore={activeResult.opponentScore}
          clock="FT"
        />
      </div>

      <h1 className="mt-10 max-w-3xl text-center font-display text-title font-black italic uppercase text-white sm:text-headline-sm">
        {headline}
      </h1>

      <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          {homeSquadOrdered.map((player) => (
            <SquadRow key={player.id} player={player} marks={contributionMarks(contributions.get(player.name))} />
          ))}
        </div>

        <div className="flex w-full flex-col justify-center gap-6 lg:w-72">
          <StatBar
            label="Possession"
            homeValue={activeResult.stats.possession.user}
            awayValue={activeResult.stats.possession.opponent}
            homeLabel={`${activeResult.stats.possession.user}%`}
            awayLabel={`${activeResult.stats.possession.opponent}%`}
          />
          <StatBar
            label="xG"
            homeValue={activeResult.stats.xg.user}
            awayValue={activeResult.stats.xg.opponent}
            homeLabel={activeResult.stats.xg.user.toFixed(1)}
            awayLabel={activeResult.stats.xg.opponent.toFixed(1)}
          />
          <StatBar
            label="Goalkeeper Saves"
            homeValue={activeResult.stats.saves.user}
            awayValue={activeResult.stats.saves.opponent}
            homeLabel={String(activeResult.stats.saves.user)}
            awayLabel={String(activeResult.stats.saves.opponent)}
          />
          <StatBar
            label="Passes"
            homeValue={activeResult.stats.passes.user}
            awayValue={activeResult.stats.passes.opponent}
            homeLabel={String(activeResult.stats.passes.user)}
            awayLabel={String(activeResult.stats.passes.opponent)}
          />
        </div>

        <div className="space-y-3">
          {awaySquadOrdered.map((player) => (
            <SquadRow key={player.id} player={player} marks={contributionMarks(contributions.get(player.name))} />
          ))}
        </div>
      </div>

      <div className="mt-10 max-w-2xl text-center">
        <p className="font-display text-lg font-black italic uppercase text-white">
          Player of the Match <span className="text-brand-yellow">{activeResult.playerOfMatch.name}</span>
        </p>
        <p className="mt-4 text-sm text-white/80">{recapBlurb(activeResult, homeName, awayName)}</p>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <div className="w-full sm:w-56">
          <PillButton onClick={() => setShareOpen(true)}>Share Match Results</PillButton>
        </div>
        <div className="w-full sm:w-56">
          <PillButton onClick={handleNewGame}>New Game</PillButton>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        data={{
          homeName,
          awayName,
          homeScore: activeResult.userScore,
          awayScore: activeResult.opponentScore,
          homeSquad: activeSquad,
          awaySquad: activeResult.opponent,
          headline,
          description: recapBlurb(activeResult, homeName, awayName),
          contributions,
        }}
      />
    </main>
  );
}

export default function MatchSummaryPage() {
  return (
    <Suspense fallback={null}>
      <MatchSummaryContent />
    </Suspense>
  );
}
