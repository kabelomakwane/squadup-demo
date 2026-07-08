export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Player = {
  id: string;
  name: string;
  position: Position;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  defending: number;
};

export type EventType =
  | "goal"
  | "save"
  | "miss"
  | "foul"
  | "corner"
  | "near-miss"
  | "half-time";

export type Team = "user" | "opponent";

export type MatchEvent = {
  minuteInGame: number;
  half: 1 | 2;
  type: EventType;
  text: string;
  team: Team | null;
  actingPlayer: string | null;
  secondaryPlayer: string | null;
};

export type MatchStats = {
  possession: { user: number; opponent: number };
  xg: { user: number; opponent: number };
  saves: { user: number; opponent: number };
  passes: { user: number; opponent: number };
};

export type MatchResult = {
  userScore: number;
  opponentScore: number;
  events: MatchEvent[];
  stats: MatchStats;
  playerOfMatch: Player;
  opponent: Player[];
};
