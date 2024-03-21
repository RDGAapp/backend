import type { Knex } from 'knex';

const tableName = 'posts';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer('author_rdga_number');
    table.foreign('author_rdga_number').references('players.rdga_number');
  });
  await knex(tableName).where({ author: 'Создатель' }).update({ author_rdga_number: 24 });
  await knex(tableName).where({ author: 'Сартаков Иван' }).update({ author_rdga_number: 6 });
  await knex(tableName).where({ author: 'Иван Сартаков' }).update({ author_rdga_number: 6 });

  await knex.schema.alterTable(tableName, (table) => {
    table.integer('author_rdga_number').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('author_rdga_number');
  });
}
