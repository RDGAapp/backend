import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('player', table => {
    table.increments('id');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('player');
}
