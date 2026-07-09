import type { MatchEvent, MatchResult, MatchStats, Player, Team } from "./types";
import { commentaryFor } from "./commentary-templates";
import { SQUAD_SLOTS } from "@/store/squadStore";

const HALF_LENGTH = 15;
const MIN_EVENT_GAP = 1;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeighted<T>(items: T[], weight: (item: T) => number): T {
  const total = items.reduce((sum, item) => sum + weight(item), 0);
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= weight(item);
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

export function pickOpponentSquad(userSquad: Player[], pool: Player[]): Player[] {
  const excludedIds = new Set(userSquad.map((p) => p.id));
  const available = pool.filter((p) => !excludedIds.has(p.id));

  return SQUAD_SLOTS.map((position) => {
    const candidates = available.filter(
      (p) => p.position === position && !excludedIds.has(p.id),
    );
    const chosen =
      candidates.length > 0
        ? candidates[randomInt(0, candidates.length - 1)]
        : available[randomInt(0, available.length - 1)];
    excludedIds.add(chosen.id);
    return chosen;
  });
}

function attackRating(squad: Player[]): number {
  const positionWeight: Record<string, number> = { FWD: 1.5, MID: 1.2, DEF: 0.6, GK: 0.2 };
  let weightedSum = 0;
  let totalWeight = 0;
  for (const player of squad) {
    const weight = positionWeight[player.position] ?? 1;
    const score = player.shooting * 0.6 + player.passing * 0.4;
    weightedSum += score * weight;
    totalWeight += weight;
  }
  return weightedSum / totalWeight;
}

function defenseRating(squad: Player[]): number {
  const positionWeight: Record<string, number> = { GK: 1.5, DEF: 1.3, MID: 0.8, FWD: 0.3 };
  let weightedSum = 0;
  let totalWeight = 0;
  for (const player of squad) {
    const weight = positionWeight[player.position] ?? 1;
    weightedSum += player.defending * weight;
    totalWeight += weight;
  }
  return weightedSum / totalWeight;
}

function passingRating(squad: Player[]): number {
  return squad.reduce((sum, p) => sum + p.passing, 0) / squad.length;
}

function keeperOf(squad: Player[]): Player {
  return squad.find((p) => p.position === "GK") ?? squad[0];
}

function pickShooter(squad: Player[]): Player {
  const outfield = squad.filter((p) => p.position !== "GK");
  const weight: Record<string, number> = { FWD: 3, MID: 2, DEF: 1 };
  return pickWeighted(outfield, (p) => (weight[p.position] ?? 1) * (p.shooting + p.pace));
}

function pickAssister(squad: Player[], exclude: Player): Player | null {
  const candidates = squad.filter((p) => p.position !== "GK" && p.id !== exclude.id);
  if (candidates.length === 0) return null;
  if (Math.random() > 0.55) return null;
  return pickWeighted(candidates, (p) => p.passing);
}

function pickDefender(squad: Player[]): Player {
  const defenders = squad.filter((p) => p.position === "DEF");
  const pool = defenders.length > 0 ? defenders : squad.filter((p) => p.position !== "GK");
  return pickWeighted(pool, (p) => p.defending);
}

type Chance = { minute: number; half: 1 | 2; team: Team };

function scheduleChances(
  half: 1 | 2,
  userRate: number,
  opponentRate: number,
): Chance[] {
  const chances: Chance[] = [];
  const totalRate = userRate + opponentRate;
  const count = randomInt(3, 6) + Math.round(totalRate / 40);

  const minutes: number[] = [];
  for (let i = 0; i < count; i++) {
    minutes.push(randomInt(1, HALF_LENGTH - 1));
  }
  minutes.sort((a, b) => a - b);

  const spaced: number[] = [];
  for (const minute of minutes) {
    const last = spaced[spaced.length - 1];
    spaced.push(last !== undefined && minute - last < MIN_EVENT_GAP ? last + MIN_EVENT_GAP : minute);
  }

  for (const minute of spaced) {
    if (minute > HALF_LENGTH) continue;
    const team: Team = Math.random() < userRate / totalRate ? "user" : "opponent";
    chances.push({ minute, half, team });
  }

  return chances;
}

function resolveChance(
  chance: Chance,
  userSquad: Player[],
  opponentSquad: Player[],
): { event: MatchEvent; isGoal: boolean; xg: number } {
  const attackingSquad = chance.team === "user" ? userSquad : opponentSquad;
  const defendingSquad = chance.team === "user" ? opponentSquad : userSquad;

  const shooter = pickShooter(attackingSquad);
  const assister = pickAssister(attackingSquad, shooter);
  const keeper = keeperOf(defendingSquad);
  const defender = pickDefender(defendingSquad);

  const offenseScore = shooter.shooting * 0.6 + shooter.pace * 0.4;
  const defenseScore = keeper.defending * 0.6 + defender.defending * 0.4;
  const quality = Math.max(0.05, Math.min(0.95, (offenseScore - defenseScore) / 100 + 0.45));

  const roll = Math.random();
  let type: MatchEvent["type"];
  let isGoal = false;

  if (roll < quality * 0.55) {
    type = "goal";
    isGoal = true;
  } else if (roll < quality * 0.55 + 0.3) {
    type = "save";
  } else {
    type = "miss";
  }

  const text = commentaryFor(type, {
    scorer: shooter.name,
    assist: assister?.name,
    keeper: keeper.name,
    defender: defender.name,
  });

  return {
    event: {
      minuteInGame: chance.half === 1 ? chance.minute : HALF_LENGTH + chance.minute,
      half: chance.half,
      type,
      text,
      team: chance.team,
      actingPlayer: shooter.name,
      secondaryPlayer: type === "goal" ? (assister?.name ?? null) : type === "save" ? keeper.name : defender.name,
    },
    isGoal,
    xg: quality,
  };
}

function scheduleCosmeticEvents(half: 1 | 2, userSquad: Player[], opponentSquad: Player[]): MatchEvent[] {
  const events: MatchEvent[] = [];
  const count = randomInt(1, 3);
  const minutes = Array.from({ length: count }, () => randomInt(1, HALF_LENGTH - 1)).sort((a, b) => a - b);

  for (const minute of minutes) {
    const team: Team = Math.random() < 0.5 ? "user" : "opponent";
    const attackingSquad = team === "user" ? userSquad : opponentSquad;
    const defendingSquad = team === "user" ? opponentSquad : userSquad;
    const type = pickWeighted(
      ["foul", "corner", "near-miss"] as const,
      () => 1,
    );
    const scorer = pickShooter(attackingSquad);
    const defender = pickDefender(defendingSquad);
    const keeper = keeperOf(defendingSquad);

    events.push({
      minuteInGame: half === 1 ? minute : HALF_LENGTH + minute,
      half,
      type,
      text: commentaryFor(type, { scorer: scorer.name, defender: defender.name, keeper: keeper.name }),
      team,
      actingPlayer: scorer.name,
      secondaryPlayer: defender.name,
    });
  }

  return events;
}

function computeStats(
  userSquad: Player[],
  opponentSquad: Player[],
  events: MatchEvent[],
  xgByTeam: { user: number; opponent: number },
): MatchStats {
  const userPassing = passingRating(userSquad);
  const opponentPassing = passingRating(opponentSquad);
  const possessionUser = Math.round((userPassing / (userPassing + opponentPassing)) * 100);

  const saves = { user: 0, opponent: 0 };
  for (const event of events) {
    if (event.type === "save") {
      // A save event belongs to the attacking team that took the shot;
      // the *other* team's keeper made the stop.
      if (event.team === "user") saves.opponent += 1;
      else if (event.team === "opponent") saves.user += 1;
    }
  }

  const totalPasses = randomInt(320, 520);

  return {
    possession: { user: possessionUser, opponent: 100 - possessionUser },
    xg: { user: Math.round(xgByTeam.user * 10) / 10, opponent: Math.round(xgByTeam.opponent * 10) / 10 },
    saves,
    passes: {
      user: Math.round((totalPasses * possessionUser) / 100),
      opponent: Math.round((totalPasses * (100 - possessionUser)) / 100),
    },
  };
}

function computePlayerOfMatch(
  userSquad: Player[],
  opponentSquad: Player[],
  events: MatchEvent[],
): Player {
  const scoreByName = new Map<string, number>();
  const allPlayers = [...userSquad, ...opponentSquad];
  const byName = new Map(allPlayers.map((p) => [p.name, p]));

  for (const event of events) {
    if (event.type === "goal" && event.actingPlayer) {
      scoreByName.set(event.actingPlayer, (scoreByName.get(event.actingPlayer) ?? 0) + 3);
    }
    if (event.type === "save" && event.secondaryPlayer) {
      scoreByName.set(event.secondaryPlayer, (scoreByName.get(event.secondaryPlayer) ?? 0) + 1);
    }
  }

  let best: Player = allPlayers[0];
  let bestScore = -1;
  for (const player of allPlayers) {
    const score = scoreByName.get(player.name) ?? 0;
    if (score > bestScore || (score === bestScore && player.overall > best.overall)) {
      best = player;
      bestScore = score;
    }
  }

  return byName.get(best.name) ?? best;
}

export function simulateMatch(userSquad: Player[], playerPool: Player[]): MatchResult {
  const opponentSquad = pickOpponentSquad(userSquad, playerPool);

  const userAttack = attackRating(userSquad);
  const userDefense = defenseRating(userSquad);
  const opponentAttack = attackRating(opponentSquad);
  const opponentDefense = defenseRating(opponentSquad);

  const userChanceRate = Math.max(10, userAttack - opponentDefense * 0.3 + 50);
  const opponentChanceRate = Math.max(10, opponentAttack - userDefense * 0.3 + 50);

  const events: MatchEvent[] = [];
  let userScore = 0;
  let opponentScore = 0;
  const xgByTeam = { user: 0, opponent: 0 };

  for (const half of [1, 2] as const) {
    const chances = scheduleChances(half, userChanceRate, opponentChanceRate);
    for (const chance of chances) {
      const { event, isGoal, xg } = resolveChance(chance, userSquad, opponentSquad);
      events.push(event);
      if (chance.team === "user") xgByTeam.user += xg;
      else xgByTeam.opponent += xg;
      if (isGoal) {
        if (chance.team === "user") userScore += 1;
        else opponentScore += 1;
      }
    }

    events.push(...scheduleCosmeticEvents(half, userSquad, opponentSquad));

    if (half === 1) {
      events.push({
        minuteInGame: HALF_LENGTH,
        half: 1,
        type: "half-time",
        text: commentaryFor("half-time", {}),
        team: null,
        actingPlayer: null,
        secondaryPlayer: null,
      });
    }
  }

  events.sort((a, b) => a.minuteInGame - b.minuteInGame);

  const stats = computeStats(userSquad, opponentSquad, events, xgByTeam);
  const playerOfMatch = computePlayerOfMatch(userSquad, opponentSquad, events);

  return {
    userScore,
    opponentScore,
    events,
    stats,
    playerOfMatch,
    opponent: opponentSquad,
  };
}
