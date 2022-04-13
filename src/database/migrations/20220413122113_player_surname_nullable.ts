import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('player', (table) => {
    table.string('surname').defaultTo(null).alter();
  });
  await knex('player').where({ surname: '-' }).update({ surname: null });
}


export async function down(knex: Knex): Promise<void> {
  await knex('player').where({ surname: null }).update({ surname: '-' });
  await knex.schema.alterTable('player', (table) => {
    table.string('surname').notNullable().alter();
  });
}

