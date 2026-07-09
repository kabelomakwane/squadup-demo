import { describe, expect, it } from "vitest";
import { scheduleEvents, matchClockLabel, FIRST_HALF_END_MS, HALFTIME_END_MS, SECOND_HALF_END_MS, FULL_TIME_MS } from "./pacing";
import type { MatchEvent } from "./types";

function makeEvent(overrides: Partial<MatchEvent> = {}): MatchEvent {
  return {
    minuteInGame: 5,
    half: 1,
    type: "miss",
    text: "A decent chance goes begging.",
    team: "user",
    actingPlayer: "Player A",
    secondaryPlayer: null,
    ...overrides,
  };
}

describe("scheduleEvents", () => {
  it("schedules events in strictly non-decreasing atMs order within the match window", () => {
    const events = [
      makeEvent({ minuteInGame: 3, half: 1 }),
      makeEvent({ minuteInGame: 9, half: 1 }),
      makeEvent({ minuteInGame: 15, half: 1, type: "half-time", text: "Half-time.", team: null, actingPlayer: null }),
      makeEvent({ minuteInGame: 18, half: 2 }),
      makeEvent({ minuteInGame: 27, half: 2 }),
    ];
    const paced = scheduleEvents(events);

    expect(paced).toHaveLength(events.length);
    for (let i = 1; i < paced.length; i++) {
      expect(paced[i].atMs).toBeGreaterThanOrEqual(paced[i - 1].atMs);
    }
    for (const event of paced) {
      expect(event.atMs).toBeGreaterThanOrEqual(0);
      expect(event.atMs).toBeLessThanOrEqual(FULL_TIME_MS);
    }
  });

  it("places the half-time event exactly at the first-half boundary", () => {
    const events = [
      makeEvent({ minuteInGame: 3, half: 1 }),
      makeEvent({ minuteInGame: 15, half: 1, type: "half-time", text: "Half-time.", team: null, actingPlayer: null }),
      makeEvent({ minuteInGame: 20, half: 2 }),
    ];
    const paced = scheduleEvents(events);
    const halfTime = paced.find((e) => e.type === "half-time");

    expect(halfTime?.atMs).toBe(FIRST_HALF_END_MS);
  });

  it("keeps first-half events within the first-half window and second-half events within theirs", () => {
    const events = [
      makeEvent({ minuteInGame: 1, half: 1 }),
      makeEvent({ minuteInGame: 5, half: 1 }),
      makeEvent({ minuteInGame: 10, half: 1 }),
      makeEvent({ minuteInGame: 16, half: 2 }),
      makeEvent({ minuteInGame: 25, half: 2 }),
      makeEvent({ minuteInGame: 29, half: 2 }),
    ];
    const paced = scheduleEvents(events);

    for (const event of paced.filter((e) => e.half === 1)) {
      expect(event.atMs).toBeLessThanOrEqual(FIRST_HALF_END_MS);
    }
    for (const event of paced.filter((e) => e.half === 2)) {
      expect(event.atMs).toBeGreaterThanOrEqual(HALFTIME_END_MS);
      expect(event.atMs).toBeLessThanOrEqual(SECOND_HALF_END_MS);
    }
  });

  it("handles an empty events array without throwing", () => {
    expect(() => scheduleEvents([])).not.toThrow();
    expect(scheduleEvents([])).toEqual([]);
  });
});

describe("matchClockLabel", () => {
  it("starts at 00:00", () => {
    expect(matchClockLabel(0)).toBe("00:00");
  });

  it("shows Half Time just before the half-time boundary", () => {
    expect(matchClockLabel(HALFTIME_END_MS - 500)).toBe("Half Time");
  });

  it("shows 15:00-based minutes in the second half", () => {
    const label = matchClockLabel(HALFTIME_END_MS + 1000);
    expect(label.startsWith("15:") || label.startsWith("16:")).toBe(true);
  });

  it("shows injury time notation near full time", () => {
    const label = matchClockLabel(FULL_TIME_MS - 500);
    expect(label).toMatch(/^30:00 \+0:\d{2}$/);
  });
});
