-- Squad Up schema: players catalogue, saved squads, match results.

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  position text not null check (position in ('GK', 'DEF', 'MID', 'FWD')),
  overall smallint not null check (overall between 1 and 99),
  pace smallint not null check (pace between 1 and 99),
  shooting smallint not null check (shooting between 1 and 99),
  passing smallint not null check (passing between 1 and 99),
  defending smallint not null check (defending between 1 and 99)
);

alter table players enable row level security;

create policy "players are publicly readable"
  on players for select
  using (true);

create table if not exists squads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  player_ids jsonb not null,
  created_at timestamptz not null default now(),
  constraint squads_user_id_key unique (user_id)
);

alter table squads enable row level security;

create policy "users manage their own squad"
  on squads for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists match_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  squad_player_ids jsonb not null,
  opponent_snapshot jsonb not null,
  user_score smallint not null,
  opponent_score smallint not null,
  commentary_log jsonb not null,
  stats jsonb not null,
  player_of_match jsonb not null,
  created_at timestamptz not null default now()
);

alter table match_results enable row level security;

create policy "users read their own match results"
  on match_results for select
  using (auth.uid() = user_id);

create policy "users insert their own match results"
  on match_results for insert
  with check (auth.uid() = user_id);
