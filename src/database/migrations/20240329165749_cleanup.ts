import type { Knex } from 'knex';

const playerSportsCategoryToEnum: Record<string, string> = {
  master: 'master',
  candidate: 'candidate',
  'adult-1': 'adult-first',
  'adult-2': 'adult-second',
  'adult-3': 'adult-third',
  'junior-1': 'junior-first',
  'junior-2': 'junior-second',
  'junior-3': 'junior-third',
};
const playerSportsCategoryToDb: Record<string, string> = {
  master: 'master',
  candidate: 'candidate',
  'adult-first': 'adult-1',
  'adult-second': 'adult-2',
  'adult-third': 'adult-3',
  'junior-first': 'junior-1',
  'junior-second': 'junior-2',
  'junior-third': 'junior-3',
};

const tournamentTypeToEnum: Record<string, string> = {
  чр: 'russian_championship',
  'про тур': 'pro',
  федеральный: 'federal',
  лига: 'league',
  МВЗ: 'all_star',
  региональный: 'regional',
  национальный: 'national',
};
const tournamentTypeToDb: Record<string, string> = {
  russian_championship: 'чр',
  pro: 'про тур',
  federal: 'федеральный',
  league: 'лига',
  all_star: 'МВЗ',
  regional: 'региональный',
  national: 'национальный',
};

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('players', 'player');
  await knex.schema.renameTable('tournaments', 'tournament');
  await knex.schema.renameTable('posts', 'post');

  await knex.schema.alterTable('player', (table) => {
    table
      .enum(
        'sports_category_enum',
        [
          'master',
          'candidate',
          'adult-first',
          'adult-second',
          'adult-third',
          'junior-first',
          'junior-second',
          'junior-third',
        ],
        {
          useNative: true,
          enumName: 'sports_category',
        },
      )
      .nullable()
      .defaultTo(null);
  });
  const players = (await knex('player').select()).filter(
    (player) => !!player.sports_category,
  );
  await Promise.all(
    players.map((player) =>
      knex('player')
        .update({
          sports_category_enum:
            playerSportsCategoryToEnum[player.sports_category],
        })
        .where({ rdga_number: player.rdga_number }),
    ),
  );
  await knex.schema.alterTable('player', (table) => {
    table.dropColumn('sports_category');
    table.renameColumn('sports_category_enum', 'sports_category');
  });

  await knex.schema.alterTable('tournament', (table) => {
    table
      .enum(
        'tournament_type_enum',
        [
          'russian_championship',
          'pro',
          'federal',
          'league',
          'all_star',
          'regional',
          'national',
        ],
        {
          useNative: true,
          enumName: 'tournament_type',
        },
      )
      .notNullable()
      .defaultTo('regional');
  });
  const tournaments = await knex('tournament').select();
  await Promise.all(
    tournaments.map((tournament) =>
      knex('tournament')
        .update({
          tournament_type_enum:
            tournamentTypeToEnum[tournament.tournament_type],
        })
        .where({ code: tournament.code }),
    ),
  );
  await knex.schema.alterTable('tournament', (table) => {
    table.dropColumn('tournament_type');
    table.renameColumn('tournament_type_enum', 'tournament_type');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('player', 'players');
  await knex.schema.renameTable('tournament', 'tournaments');
  await knex.schema.renameTable('post', 'posts');

  await knex.schema.alterTable('players', (table) => {
    table.renameColumn('sports_category', 'sports_category_enum');
  });
  await knex.schema.alterTable('players', (table) => {
    table
      .enum('sports_category', [
        'master',
        'candidate',
        'adult-1',
        'adult-2',
        'adult-3',
        'junior-1',
        'junior-2',
        'junior-3',
      ])
      .nullable()
      .defaultTo(null);
  });
  const players = (await knex('players').select()).filter(
    (player) => !!player.sports_category_enum,
  );
  await Promise.all(
    players.map((player) =>
      knex('players')
        .update({
          sports_category:
            playerSportsCategoryToDb[player.sports_category_enum],
        })
        .where({ rdga_number: player.rdga_number }),
    ),
  );
  await knex.schema.alterTable('players', (table) => {
    table.dropColumn('sports_category_enum');
  });
  await knex.raw('DROP TYPE sports_category');

  await knex.schema.alterTable('tournaments', (table) => {
    table.renameColumn('tournament_type', 'tournament_type_enum');
  });
  await knex.schema.alterTable('tournaments', (table) => {
    table
      .enum('tournament_type', [
        'чр',
        'про тур',
        'федеральный',
        'лига',
        'МВЗ',
        'региональный',
        'национальный тур',
      ])
      .notNullable()
      .defaultTo('региональный');
  });
  const tournaments = await knex('tournaments').select();
  await Promise.all(
    tournaments.map((tournament) =>
      knex('tournaments')
        .update({
          tournament_type: tournamentTypeToDb[tournament.tournament_type_enum],
        })
        .where({ code: tournament.code }),
    ),
  );
  await knex.schema.alterTable('tournaments', (table) => {
    table.dropColumn('tournament_type_enum');
  });
  await knex.raw('DROP TYPE tournament_type');
}
