import { Knex } from 'knex';

const tableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.date('active_to').notNullable().defaultTo('2023-04-01T00:00:00.000Z');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('active_to');
  });
}
