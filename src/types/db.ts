// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum SportsCategory {
  Master = "master",
  Candidate = "candidate",
  AdultFirst = "adult-first",
  AdultSecond = "adult-second",
  AdultThird = "adult-third",
  JuniorFirst = "junior-first",
  JuniorSecond = "junior-second",
  JuniorThird = "junior-third",
}

export enum TournamentType {
  RussianChampionship = "russian_championship",
  Pro = "pro",
  Federal = "federal",
  League = "league",
  AllStar = "all_star",
  Regional = "regional",
  National = "national",
}

export enum Table {
  AuthData = "auth_data",
  KnexMigrations = "knex_migrations",
  KnexMigrationsLock = "knex_migrations_lock",
  Player = "player",
  PlayerRoles = "player_roles",
  Post = "post",
  Role = "role",
  Tournament = "tournament",
}

export type Tables = {
  "auth_data": AuthData,
  "knex_migrations": KnexMigrations,
  "knex_migrations_lock": KnexMigrationsLock,
  "player": Player,
  "player_roles": PlayerRoles,
  "post": Post,
  "role": Role,
  "tournament": Tournament,
};

export type AuthData = {
  rdga_number: number;
  telegram_id: number;
  telegram_auth_date: number;
  telegram_username: string;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  telegram_photo_url: string | null;
};

export type KnexMigrations = {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
};

export type KnexMigrationsLock = {
  index: number;
  is_locked: number | null;
};

export type Player = {
  rdga_number: number;
  name: string;
  surname: string | null;
  rdga_rating: number;
  rdga_rating_change: number | null;
  town: string | null;
  pdga_number: number | null;
  metrix_number: number | null;
  active_to: Date;
  sports_category: SportsCategory | null;
};

export type PlayerRoles = {
  id: number;
  player_rdga_number: number;
  role_code: string;
};

export type Post = {
  code: string;
  author: string | null;
  header: string;
  text: string;
  created_at: Date;
  author_rdga_number: number;
};

export type Role = {
  code: string;
  name: string;
  can_manage_players: boolean;
  can_manage_tournaments: boolean;
  can_manage_blog_post: boolean;
  can_manage_blog_posts: boolean;
  can_manage_roles: boolean;
  can_assign_roles: boolean;
};

export type Tournament = {
  code: string;
  name: string;
  town: string;
  start_date: Date;
  end_date: Date;
  metrix_id: string | null;
  tournament_type: TournamentType;
};

