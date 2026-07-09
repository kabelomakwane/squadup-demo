import { describe, expect, it } from "vitest";
import { simulateMatch, pickOpponentSquad } from "./simulate";
import type { Player, Position } from "./types";

function makePlayer(id: string, position: Position, overrides: Partial<Player> = {}): Player {
  return {
    id,
    name: `Player ${id}`,
    position,
    overall: 70,
    pace: 70,
    shooting: 70,
    passing: 70,
    defending: 70,
    ...overrides,
  };
}

function buildPool(count: number): Player[] {
  const positions: Position[] = ["GK", "DEF", "MID", "FWD"];
  return Array.from({ length: count }, (_, i) =>
    makePlayer(`pool-${i}`, positions[i % positions.length], {
      overall: 40 + (i % 60),
      pace: 40 + ((i * 3) % 60),
      shooting: 40 + ((i * 5) % 60),
      passing: 40 + ((i * 7) % 60),
      defending: 40 + ((i * 11) % 60),
    }),
  );
}

function buildUserSquad(): Player[] {
  return [
    makePlayer("u-gk", "GK", { defending: 80, shooting: 5 }),
    makePlayer("u-def", "DEF", { defending: 78 }),
    makePlayer("u-mid1", "MID", { passing: 82 }),
    makePlayer("u-mid2", "MID", { passing: 75 }),
    makePlayer("u-fwd", "FWD", { shooting: 85, pace: 88 }),
  ];
}

describe("pickOpponentSquad", () => {
  it("always returns 5 distinct players excluding the user's squad", () => {
    const pool = buildPool(80);
    const userSquad = buildUserSquad();
    const opponent = pickOpponentSquad(userSquad, pool);

    expect(opponent).toHaveLength(5);
    const ids = new Set(opponent.map((p) => p.id));
    expect(ids.size).toBe(5);

    const userIds = new Set(userSquad.map((p) => p.id));
    for (const player of opponent) {
      expect(userIds.has(player.id)).toBe(false);
    }
  });
});

describe("simulateMatch", () => {
  const pool = buildPool(80);

  it("produces non-negative scores and a full 5-a-side opponent", () => {
    const result = simulateMatch(buildUserSquad(), pool);

    expect(result.userScore).toBeGreaterThanOrEqual(0);
    expect(result.opponentScore).toBeGreaterThanOrEqual(0);
    expect(result.opponent).toHaveLength(5);
  });

  it("orders events by strictly non-decreasing minuteInGame across both halves (0-30)", () => {
    const result = simulateMatch(buildUserSquad(), pool);

    for (let i = 1; i < result.events.length; i++) {
      expect(result.events[i].minuteInGame).toBeGreaterThanOrEqual(result.events[i - 1].minuteInGame);
    }
    for (const event of result.events) {
      expect(event.minuteInGame).toBeGreaterThanOrEqual(0);
      expect(event.minuteInGame).toBeLessThanOrEqual(30);
    }
  });

  it("names a specific acting player on every non-half-time event", () => {
    const result = simulateMatch(buildUserSquad(), pool);

    for (const event of result.events) {
      if (event.type === "half-time") continue;
      expect(event.actingPlayer).toBeTruthy();
    }
  });

  it("keeps stats within valid ranges", () => {
    const result = simulateMatch(buildUserSquad(), pool);
    const { stats } = result;

    expect(stats.possession.user + stats.possession.opponent).toBe(100);
    expect(stats.possession.user).toBeGreaterThanOrEqual(0);
    expect(stats.possession.opponent).toBeGreaterThanOrEqual(0);

    expect(stats.xg.user).toBeGreaterThanOrEqual(0);
    expect(stats.xg.opponent).toBeGreaterThanOrEqual(0);

    expect(stats.saves.user).toBeGreaterThanOrEqual(0);
    expect(stats.saves.opponent).toBeGreaterThanOrEqual(0);

    expect(stats.passes.user).toBeGreaterThanOrEqual(0);
    expect(stats.passes.opponent).toBeGreaterThanOrEqual(0);
  });

  it("picks a player of the match from one of the two squads", () => {
    const userSquad = buildUserSquad();
    const result = simulateMatch(userSquad, pool);

    const allNames = new Set([...userSquad, ...result.opponent].map((p) => p.name));
    expect(allNames.has(result.playerOfMatch.name)).toBe(true);
  });

  it("is stable across repeated runs (no crashes, always resolves)", () => {
    for (let i = 0; i < 25; i++) {
      expect(() => simulateMatch(buildUserSquad(), pool)).not.toThrow();
    }
  });
});
