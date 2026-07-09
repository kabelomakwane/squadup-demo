import type { EventType } from "./types";

type TemplateSlots = {
  scorer?: string;
  assist?: string;
  keeper?: string;
  defender?: string;
};

const GOAL_WITH_ASSIST = [
  "GOOOOOAL! {scorer} finishes off a brilliant ball from {assist}!",
  "GOOOOOAL! {assist} threads it through and {scorer} makes no mistake!",
  "GOOOOOAL! {scorer} taps home after {assist} does all the hard work!",
];

const GOAL_SOLO = [
  "GOOOOOAL! {scorer} finds the net!",
  "GOOOOOAL! {scorer} smashes it into the top corner!",
  "GOOOOOAL! {scorer} with a moment of pure quality!",
];

const SAVE = [
  "{scorer} unleashes a effort, but {keeper} is equal to it!",
  "What a stop! {keeper} denies {scorer} at the near post!",
  "{scorer} goes for goal — {keeper} tips it over the bar!",
];

const MISS = [
  "{scorer} skies it over the bar!",
  "{scorer} can't quite get a hold of that one, wide of the mark.",
  "{defender} throws a body in the way to block {scorer}'s effort!",
];

const FOUL = [
  "Free kick given away by {defender} on {scorer}.",
  "{defender} clatters into {scorer} — the referee blows for a foul.",
];

const CORNER = [
  "{defender} deflects it behind — corner to the attack.",
  "Good pressure from {scorer} forces a corner.",
];

const NEAR_MISS = [
  "So close! {scorer}'s effort clips the outside of the post!",
  "{scorer} nearly caught {keeper} out with that one — inches wide!",
];

const HALF_TIME = ["The referee blows the whistle — it's half-time."];

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function fill(template: string, slots: TemplateSlots): string {
  return template
    .replace("{scorer}", slots.scorer ?? "")
    .replace("{assist}", slots.assist ?? "")
    .replace("{keeper}", slots.keeper ?? "")
    .replace("{defender}", slots.defender ?? "");
}

export function commentaryFor(type: EventType, slots: TemplateSlots): string {
  switch (type) {
    case "goal":
      return fill(pick(slots.assist ? GOAL_WITH_ASSIST : GOAL_SOLO), slots);
    case "save":
      return fill(pick(SAVE), slots);
    case "miss":
      return fill(pick(MISS), slots);
    case "foul":
      return fill(pick(FOUL), slots);
    case "corner":
      return fill(pick(CORNER), slots);
    case "near-miss":
      return fill(pick(NEAR_MISS), slots);
    case "half-time":
      return pick(HALF_TIME);
    default:
      return "";
  }
}
