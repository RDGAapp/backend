import type { Knex } from 'knex';

const tableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
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
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('sports_category');
  });
}
