import { describe, expect, it } from "vitest";
import { computeContributions, contributionMarks } from "./contributions";
import type { MatchEvent } from "./types";

function makeEvent(overrides: Partial<MatchEvent> = {}): MatchEvent {
  return {
    minuteInGame: 5,
    half: 1,
    type: "miss",
    text: "text",
    team: "user",
    actingPlayer: null,
    secondaryPlayer: null,
    ...overrides,
  };
}

describe("computeContributions", () => {
  it("counts goals for the acting player and assists for the secondary player", () => {
    const events: MatchEvent[] = [
      makeEvent({ type: "goal", actingPlayer: "Scorer", secondaryPlayer: "Assister" }),
      makeEvent({ type: "goal", actingPlayer: "Scorer", secondaryPlayer: null }),
    ];
    const contributions = computeContributions(events);

    expect(contributions.get("Scorer")).toEqual({ goals: 2, assists: 0, saves: 0 });
    expect(contributions.get("Assister")).toEqual({ goals: 0, assists: 1, saves: 0 });
  });

  it("counts saves for the secondary player (the keeper)", () => {
    const events: MatchEvent[] = [
      makeEvent({ type: "save", actingPlayer: "Shooter", secondaryPlayer: "Keeper" }),
      makeEvent({ type: "save", actingPlayer: "Shooter", secondaryPlayer: "Keeper" }),
    ];
    const contributions = computeContributions(events);

    expect(contributions.get("Keeper")).toEqual({ goals: 0, assists: 0, saves: 2 });
    expect(contributions.has("Shooter")).toBe(false);
  });

  it("ignores non-goal, non-save events entirely", () => {
    const events: MatchEvent[] = [
      makeEvent({ type: "foul", actingPlayer: "Fouler", secondaryPlayer: "Fouled" }),
      makeEvent({ type: "corner", actingPlayer: "Taker", secondaryPlayer: "Defender" }),
    ];
    const contributions = computeContributions(events);

    expect(contributions.size).toBe(0);
  });
});

describe("contributionMarks", () => {
  it("returns an empty string for undefined contribution", () => {
    expect(contributionMarks(undefined)).toBe("");
  });

  it("repeats emoji per goal and assist, and shows a save count only when saves > 1", () => {
    expect(contributionMarks({ goals: 2, assists: 1, saves: 0 })).toBe("⚽⚽🎯");
    expect(contributionMarks({ goals: 0, assists: 0, saves: 1 })).toBe(" 🧤");
    expect(contributionMarks({ goals: 0, assists: 0, saves: 3 })).toBe(" 🧤3");
  });
});
