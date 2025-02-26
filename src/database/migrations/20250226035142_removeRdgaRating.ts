import type { Knex } from "knex";

const tableName = 'player';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('rdga_rating');
    table.dropColumn('rdga_rating_change');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.integer('rdga_rating').notNullable().defaultTo(0);
    table.integer('rdga_rating_change').defaultTo(null);
  });
}

