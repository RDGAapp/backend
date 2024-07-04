import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  integer,
  timestamp,
  unique,
  text,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const SportsCategory = pgEnum('sports_category', [
  'master',
  'candidate',
  'adult-first',
  'adult-second',
  'adult-third',
  'junior-first',
  'junior-second',
  'junior-third',
]);
export const TournamentType = pgEnum('tournament_type', [
  'russian_championship',
  'pro',
  'federal',
  'league',
  'all_star',
  'regional',
  'national',
]);

export const knex_migrations = pgTable('knex_migrations', {
  id: serial('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }),
  batch: integer('batch'),
  migration_time: timestamp('migration_time', {
    withTimezone: true,
    mode: 'string',
  }),
});

export const knex_migrations_lock = pgTable('knex_migrations_lock', {
  index: serial('index').primaryKey().notNull(),
  is_locked: integer('is_locked'),
});

export const authData = pgTable(
  'auth_data',
  {
    rdgaNumber: integer('rdga_number')
      .primaryKey()
      .notNull()
      .references(() => player.rdgaNumber),
    telegramId: integer('telegram_id').notNull(),
    telegramAuthDate: integer('telegram_auth_date').notNull(),
    telegramUsername: text('telegram_username').notNull(),
    telegramFirstName: text('telegram_first_name').default(''),
    telegramLastName: text('telegram_last_name').default(''),
    telegramPhotoUrl: text('telegram_photo_url').default(''),
  },
  (table) => {
    return {
      authDataRdgaNumberUnique: unique('auth_data_rdga_number_unique').on(
        table.rdgaNumber,
      ),
      authDataTelegramIdUnique: unique('auth_data_telegram_id_unique').on(
        table.telegramId,
      ),
      authDataTelegramUsernameUnique: unique(
        'auth_data_telegram_username_unique',
      ).on(table.telegramUsername),
    };
  },
);

export const post = pgTable(
  'post',
  {
    code: varchar('code', { length: 255 }).primaryKey().notNull(),
    author: varchar('author', { length: 255 }),
    header: varchar('header', { length: 255 }).notNull(),
    text: text('text').notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    authorRdgaNumber: integer('author_rdga_number')
      .notNull()
      .references(() => player.rdgaNumber),
  },
  (table) => {
    return {
      postsCodeUnique: unique('posts_code_unique').on(table.code),
    };
  },
);

export const player = pgTable(
  'player',
  {
    rdgaNumber: integer('rdga_number').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    surname: varchar('surname', { length: 255 }).default(sql`NULL`),
    rdgaRating: integer('rdga_rating').default(0).notNull(),
    rdgaRatingChange: integer('rdga_rating_change'),
    town: varchar('town', { length: 255 }).default(sql`NULL`),
    pdgaNumber: integer('pdga_number'),
    metrixNumber: integer('metrix_number'),
    activeTo: date('active_to').default('2023-04-01').notNull(),
    sportsCategory: SportsCategory('sports_category'),
  },
  (table) => {
    return {
      player_rdga_number_unique: unique('player_rdga_number_unique').on(
        table.rdgaNumber,
      ),
      player_pdga_number_unique: unique('player_pdga_number_unique').on(
        table.pdgaNumber,
      ),
      player_metrix_number_unique: unique('player_metrix_number_unique').on(
        table.metrixNumber,
      ),
    };
  },
);

export const tournament = pgTable(
  'tournament',
  {
    code: varchar('code', { length: 255 }).primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    town: varchar('town', { length: 255 }).notNull(),
    startDate: timestamp('start_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    endDate: timestamp('end_date', {
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    metrixId: varchar('metrix_id', { length: 255 }).default(sql`NULL`),
    tournamentType: TournamentType('tournament_type')
      .default('regional')
      .notNull(),
  },
  (table) => {
    return {
      tournamentsCodeUnique: unique('tournaments_code_unique').on(table.code),
    };
  },
);

export const playerRoles = pgTable('player_roles', {
  id: serial('id').primaryKey().notNull(),
  playerRdgaNumber: integer('player_rdga_number')
    .notNull()
    .references(() => player.rdgaNumber),
  roleCode: text('role_code')
    .notNull()
    .references(() => role.code),
});

export const role = pgTable(
  'role',
  {
    code: text('code').primaryKey().notNull(),
    name: text('name').notNull(),
    canManagePlayers: boolean('can_manage_players').default(false).notNull(),
    canManageTournaments: boolean('can_manage_tournaments')
      .default(false)
      .notNull(),
    canManageBlogPost: boolean('can_manage_blog_post').default(false).notNull(),
    canManageBlogPosts: boolean('can_manage_blog_posts')
      .default(false)
      .notNull(),
    canManageRoles: boolean('can_manage_roles').default(false).notNull(),
    canAssignRoles: boolean('can_assign_roles').default(false).notNull(),
  },
  (table) => {
    return {
      roleCodeUnique: unique('role_code_unique').on(table.code),
    };
  },
);
