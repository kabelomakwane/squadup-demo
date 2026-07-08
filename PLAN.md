# Squad Up — Fantasy 5-a-Side Web App — Build Plan

> Status: plan approved by user, implementation not yet started. This file exists so a fresh Claude Code session (started in an environment with Network access = Trusted, so `npm install` works) can pick up the build without losing context from the planning conversation, which happened in a session whose environment blocked `registry.npmjs.org`.
>
> **Instructions for the next session**: read this file in full, then work through the task list at the bottom top to bottom. All design/scope decisions below were already discussed and approved with the user — do not re-ask them. Only ask if something genuinely new comes up during implementation.

## Context

Building "Squad Up," a SuperSportBET-branded fantasy 5-a-side football web app, from scratch (repo currently only has this file + a README). The user supplied both a flowchart of the user journey and a Figma file with full visual designs for every screen. Confirmed stack: **Next.js + TypeScript**, **Supabase** (free-tier Auth + Postgres, covering user accounts and the player-ratings database), and a **mocked/simulated match engine** driven by player ratings from a curated open ratings dataset. Goal: scaffold the whole flow end-to-end, styled to match the real Figma designs, playable start to finish.

Figma file (for reference if design details need re-checking): https://www.figma.com/design/HNoSCSlGQpPsSJheVrkojZ/Squad-Up (fileKey `HNoSCSlGQpPsSJheVrkojZ`). Key node IDs already reviewed: Age Check `1:2`, Not 18 `1:994`, Landing Option 1/2 `1:996`/`1:1242`, Team Picker Option 1/2 `1:1496`/`1:2529`, Sign-In `1:3542`, Match Loading `1:4079`, Match Commentary `1:4434`, End Game `1:5500`, Match Summary `1:5625`, How To Play `1:6787`, Logo `7:3`, Style Sheet `5:2`, Score Bug `9:165`.

## Design System (from Figma "Style Sheet" frame, exact values)

**Colors** (Tailwind theme extension):
- `brand-blue: #111FA3` — dominant background
- `brand-blue-bright: #2F39FC` — active fields, links, home-goal commentary cards; paired with brand-blue in a diagonal gradient (`from-[#111FA3] to-[#2F39FC]`) on hero/splash/loading screens
- `brand-yellow: #F1C72F` — headline/branding text
- `brand-red: #DB1B13` — primary CTA buttons, away-goal cards
- `gray-mid: #999999` — placeholder text — `gray-light: #B3B3B3` — disabled state
- OAuth brand colors: Google `#4285F4`, Microsoft `#EA3C00` (icon-only, buttons disabled per decision below)

**Typography**: heavy condensed italic display font (visually Anton/Archivo Black Italic style — use a free Google Font match, e.g. **Anton** for display + **Inter** for body). Scale: Hero 120px, Primary Headline 72px, Score Display 160px, Secondary Headline 48px, Section Title 24px, Body 16px, Button 18px, Position Badge 14px — all headline-weight text is UPPERCASE.

**Component shapes**: buttons/inputs are full pill (`rounded-full`); commentary/summary cards use `rounded-lg` (~8px). Primary CTA = red pill, white bold uppercase text. OAuth/manual sign-in buttons = white pill, black text, icon right-aligned.

**Reusable `ScoreBug` component** (Figma node `9:165`): pill bar — `[Home team-name pill (yellow outline)] [white circle score] [small logo mark] [white circle score] [Away team-name pill (red outline)]`, with a floating rounded match-clock pill below center. Used as the header on Match Commentary, End Game, and Match Summary.

**Logo lockup** (Figma node `7:3`): "S" swoosh mark + "SuperSportBET" wordmark + large yellow italic "SQUAD UP" wordmark beneath — persistent header on nearly every screen.

## Confirmed Design Decisions

- **Landing Page**: build Figma "Option 2" — centered/symmetric hero, ghost background text ("GAME TIME," "COMPETE," etc.) spanning full width, gradient background.
- **Team Picker**: build Figma "Option 2" — no back-nav, HOME/AWAY labels above the pitch (not overlaid on it), simplified search inputs (position badge + score pill, no separate team-name field inline).
- **Sign-In screen**: build visually as designed (Google / Microsoft / Apple pill buttons + "OR SIGN-IN MANUALLY" link), but only the manual email/password path is functionally wired to Supabase Auth for v1. Google/Microsoft buttons render **disabled** with a "coming soon" affordance (no client credentials yet); Apple button also disabled (requires paid Apple Developer account — out of scope). Manual sign-in reveals the actual email/password form.
- **"Not 18" screen**: blank in the Figma source (placeholder). Build a simple blocked-state screen reusing Age Check's structure — headline + message that the user must be 18+ to play, no re-entry CTA — since Figma left this unfleshed out.
- **Placeholder copy flagged, not shipped verbatim**: Match Loading narrative, Commentary row/goal-card body text, Match Summary recap blurb, and the age-gate's final sentence are explicit lorem/instructional placeholders in the Figma file. Write reasonable real copy in the same tone (short, energetic, sports-broadcast style) rather than copy the lorem text — flag this so the user can revise wording later.
- **Copy to reuse verbatim** (final in the source): Age Check headline/legal footer, Landing headline/body/CTA labels, Sign-In headline/body/CTA labels, How To Play annotation text, Team Picker/ScoreBug labels ("SELECT YOUR TEAM," "ENTER TEAM NAME," "SKIP TO FINAL RESULT," "PLAY," "FINAL SCORE," position codes GK/DEF/MID/ST).
- **How To Play**: build as a lightweight annotated overlay/modal on top of the Team Picker layout (per Figma, it's literally the Team Picker screen with callout annotations), rather than a fully separate page layout.

## Stack & Structure

- Next.js 14 App Router + TypeScript, Tailwind CSS (theme = tokens above), no UI kit — hand-rolled primitives in `src/components/ui/` (`PillButton`, `Card`, `Modal`, `ScoreBug`, `PositionInput`)
- Supabase: `@supabase/supabase-js` + `@supabase/ssr` for cookie-based sessions
- Zustand (+ `persist` to sessionStorage) for squad selection & match-result state across routes
- `tsx` for the one-off DB seed script

```
src/
  app/{page.tsx, landing, how-to-play, team-picker, auth, match/{loading,live,end,summary}}
  components/{ui, team-picker, match}
  lib/{supabase/{client,server}.ts, game-engine/{simulate.ts, commentary-templates.ts, types.ts}, share.ts}
  providers/AuthProvider.tsx
  store/{squadStore.ts, matchStore.ts}
data/players.seed.json
scripts/seed-players.ts
supabase/migrations/0001_init.sql
```

## Supabase Schema (`supabase/migrations/0001_init.sql`)

- **`players`**: `id, name, position (GK|DEF|MID|FWD), overall, pace, shooting, passing, defending` — public read-only.
- **`squads`**: `id, user_id (FK auth.users), player_ids (jsonb, len 5), created_at`, `UNIQUE(user_id)` — upsert of current squad only, no history. Owner-only RLS.
- **`match_results`**: `id, user_id, squad_player_ids, opponent_snapshot, user_score, opponent_score, commentary_log (jsonb array of {minute, text, type, team}), created_at`. Owner-only RLS. Powers a real deep-linkable `/match/summary?id=` URL for Share Results.

Auth: Supabase email/password, email confirmation **disabled** for v1 (frictionless demo flow — sign up flows straight into the match).

## Player Data

- `data/players.seed.json`: hand-curated, ~150-200 real player names across GK/DEF/MID/FWD with plausible `overall/pace/shooting/passing/defending` ratings — names/ratings only, no photos (avoids imagery licensing).
- `scripts/seed-players.ts`: upserts JSON into `players` via Supabase **service role key** (server-only env var), run via `npm run db:seed`.

## Routing → Flow Mapping

| Node | Route |
|---|---|
| Age Check | `/` — Yes → `/landing`; No → `/not-eligible` |
| Not 18 | `/not-eligible` — blocked state, no CTA back in |
| Landing (Option 2) | `/landing` — How to Play / New Game |
| How to Play | overlay/modal on `/team-picker` (`?tutorial=1`), not a separate route |
| Team Picker (Option 2) | `/team-picker` — pick 5 (GK/DEF/MID/MID/ST slots), PLAY button checks session |
| Sign-In | `/auth` — manual email/password wired; OAuth buttons disabled; success → `/match/loading` |
| Match Loading | `/match/loading` — runs sim synchronously, persists `match_results`, redirects |
| Match Commentary | `/match/live` — ScoreBug header + replays event feed on a timer, "Skip to Final Result" button jumps straight to `/match/end` |
| End Game | `/match/end` — full-bleed HOME/AWAY score reveal, then → `/match/summary` |
| Match Summary | `/match/summary?id=` — ScoreBug + recap headline + stats bars (possession/xG/saves/passes) + Player of the Match + Share Results / New Game |

Both "New Game" loop-backs (Landing and Summary) route to `/team-picker`. Squad selection persists via `squadStore` (sessionStorage) across `/team-picker → /auth → /match/loading`.

Guard on `/match/*`: no session AND no stored squad/match state → redirect to `/team-picker`.

## Game Engine (`src/lib/game-engine/simulate.ts`)

**Match structure**: 2 halves × 15 in-game minutes = 30 in-game minutes total, mapped to a **60 real-world seconds** live-commentary playback (2 in-game minutes ≈ 1 real second).

Pure functions, no framework deps:
1. Opponent = 5 random players sampled from `players` (excluding user's picks).
2. Team strength = aggregate `overall` + attack/defense sub-scores from `shooting/passing` vs `defending`.
3. Generate events across two 15-minute halves at **irregular in-game-minute timestamps** (random gaps, not fixed ticks — e.g. sample event count per half from strength/pace, then scatter each event's minute randomly within its half, sort ascending, enforce a minimum gap). Half-time itself is a scheduled cosmetic event at minute 15. Weighted-random event types: filler/possession (not shown as its own card, just spacing), shot attempt (scaled by attacker shooting+pace vs defender defending), goal (conditional on shot succeeding), save/miss, cosmetic flavor (foul/corner/near-miss).
4. **Commentary must name names and actions**: every non-filler event references the specific acting player from the relevant squad (e.g. shooter), and where applicable a second player (the defender/keeper who made the save, or the player who supplied the assist/through-ball) — never generic "a player" text. Template bank per event type (incl. the "GOOOOOAL!" goal-card format from Figma) with `{scorer}`, `{assist}`, `{keeper}`, `{defender}` slots filled from the actual squads.
5. Also compute **Match Summary stats**: possession % (relative midfield/passing strength), xG (shot-attempt count/quality), goalkeeper saves (from save events), passes (from possession share), and "Player of the Match" (most goals/saves, tie-broken by `overall`).
6. Output: `{ userScore, opponentScore, events: [{minuteInGame, half, type, text, team, actingPlayer, secondaryPlayer}], stats: {possession, xg, saves, passes}, playerOfMatch, opponent }` — computed once at `/match/loading`, persisted, then replayed (not recomputed) on Live/Summary.

**Live playback**: `/match/live` maps each event's `minuteInGame` (0-30) proportionally onto the 60-second real timer and reveals/slides in event cards one-by-one at those (irregular) real-world offsets via `setTimeout` per event — not a fixed-interval loop — so pacing on screen mirrors the bursty/irregular feel of a real match. Whole feed completes in exactly 60 real seconds, then auto-advances to `/match/end`. "Skip to Final Result" cancels all pending timeouts and jumps straight there.

## Auth Wiring

- `AuthProvider` (root layout) subscribes to `supabase.auth.onAuthStateChange` → `useAuth()` → `{session, user, loading}`.
- Team Picker's PLAY button reads real session — signed in → `/match/loading`, else → `/auth`.
- `/auth` renders the full designed screen (3 OAuth pill buttons + divider + "sign in manually" link); OAuth buttons are visually present but `disabled` with a small "coming soon" badge; clicking "sign in manually" reveals a toggleable sign-in/sign-up email+password form wired to real Supabase Auth calls.

## Share Sheet (`src/lib/share.ts`)

`navigator.share({title, text, url})` on click when available; fallback `navigator.clipboard.writeText(url)` + inline "Link copied" confirmation. URL = persisted `/match/summary?id=` deep link.

## Dependencies

`next react react-dom typescript @supabase/supabase-js @supabase/ssr tailwindcss postcss autoprefixer zustand` + dev `tsx @types/node eslint eslint-config-next vitest` (vitest for the pure game-engine functions).

## Out of Scope (v1)

Real player photos/crests, live sports data feeds, payments, real multiplayer (opponent always simulated), functional Microsoft/Apple OAuth (disabled placeholders only), email verification, multi-squad history, seeded/reproducible replay, e2e tests, i18n.

## Verification

- `npm run dev`, manually walk the full loop: age check → (18+) landing → how-to-play overlay → team picker → sign up (manual) → loading → live commentary (incl. "Skip to Final Result") → end game → summary → share (verify clipboard fallback) → new game loops back to team picker; refresh persists signed-in session.
- Also check the "No" branch of age check routes to `/not-eligible` and dead-ends there.
- `npm run db:seed` against a real Supabase project, confirm `players` populates and Team Picker renders real data with position badges filled correctly.
- `npx vitest run` for game-engine unit tests (score non-negative, always 5v5, event minutes monotonic, stats within valid ranges).

## Task Checklist (work top to bottom, mark off as you go)

- [ ] Scaffold Next.js + TypeScript + Tailwind project (`create-next-app`, install zustand/@supabase/supabase-js/@supabase/ssr/tsx/vitest)
- [ ] Configure Tailwind theme with the design tokens above
- [ ] Build UI primitives (PillButton, Card, Modal, ScoreBug, PositionInput, Logo)
- [ ] Supabase schema + client setup (migration SQL, client.ts/server.ts, AuthProvider) — note: actually creating the Supabase *project* itself requires the user's Supabase account; if no project/credentials exist yet, stub `.env.local.example` and ask the user for `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`, or offer to guide them through creating a free project
- [ ] Curate player dataset (~150-200 players) + seed script
- [ ] Build game engine (simulate.ts) + vitest unit tests
- [ ] Build all pages/routes per the flow mapping table above, wired to squadStore/matchStore
- [ ] Wire share sheet (Web Share API + clipboard fallback)
- [ ] End-to-end verification: `npm run dev`, walk the full flow in a browser, run `npx vitest run`, then commit and push to `claude/squad-fantasy-web-app-8lg6ao`
