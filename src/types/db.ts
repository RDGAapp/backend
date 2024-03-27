// The TypeScript definitions below are automatically generated.
// Do not touch them, or risk, your modifications being lost.

export enum Table {
  AuthData = "auth_data",
  KnexMigrations = "knex_migrations",
  KnexMigrationsLock = "knex_migrations_lock",
  Players = "players",
  Posts = "posts",
  Roles = "roles",
  Tournaments = "tournaments",
  UserRoles = "user_roles",
}

export type Tables = {
  "auth_data": AuthData,
  "knex_migrations": KnexMigrations,
  "knex_migrations_lock": KnexMigrationsLock,
  "players": Players,
  "posts": Posts,
  "roles": Roles,
  "tournaments": Tournaments,
  "user_roles": UserRoles,
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

export type Players = {
  rdga_number: number;
  name: string;
  surname: string | null;
  rdga_rating: number;
  rdga_rating_change: number | null;
  town: string | null;
  pdga_number: number | null;
  metrix_number: number | null;
  active_to: Date;
  sports_category: string | null;
};

export type Posts = {
  code: string;
  author: string | null;
  header: string;
  text: string;
  created_at: Date;
  author_rdga_number: number;
};

export type Roles = {
  code: string;
  name: string;
};

export type Tournaments = {
  code: string;
  name: string;
  town: string;
  start_date: Date;
  end_date: Date;
  tournament_type: string;
  metrix_id: string | null;
};

export type UserRoles = {
  id: number;
  player_rdga_number: number;
  role_code: string;
};

