import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('player', table => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('surname').notNullable();
    table.string('middle_name').notNullable();
    table.integer('rdga_number').notNullable();
    table.integer('rdga_rating').notNullable().defaultTo(0);
    table.integer('rdga_rating_change').defaultTo(null);
    table.string('town').defaultTo(null);
    table.date('date_of_birth').defaultTo(null);
    table.string('email').defaultTo(null);
    table.integer('pdga_number').defaultTo(null);
    table.integer('pdga_rating').defaultTo(null);
    table.integer('metrix_number').defaultTo(null);
    table.integer('metrix_rating').defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('player');
}
