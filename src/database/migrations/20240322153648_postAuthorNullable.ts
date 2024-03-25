import type { Knex } from 'knex';

const tableName = 'posts';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('author').nullable().alter();
  });
  await knex(tableName)
    .where({ author: 'Сартаков Иван' })
    .update({ author: null });
  await knex(tableName)
    .where({ author: 'Иван Сартаков' })
    .update({ author: null });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string('author').notNullable().alter();
  });
}
