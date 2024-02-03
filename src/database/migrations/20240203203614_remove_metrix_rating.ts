import type { Knex } from 'knex';

const tableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('metrix_rating');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer('metrix_rating').defaultTo(null);
  });
}
