import { Knex } from 'knex';

const oldTableName = 'player';
const newTableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable(oldTableName, newTableName);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable(newTableName, oldTableName);
}
