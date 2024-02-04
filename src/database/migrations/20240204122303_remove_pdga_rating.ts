import type { Knex } from 'knex';

const tableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('pdga_rating');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer('pdga_rating').defaultTo(null);
  });
}
