import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', table => {
    table.string('code').notNullable().unique().primary();
    table.string('author').notNullable();
    table.string('header').notNullable();
    table.text('text').notNullable();
    table.dateTime('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('posts');
}
