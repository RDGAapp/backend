import type { Knex } from 'knex';

const tableName = 'auth_data';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (table) => {
    table.integer('rdga_number').notNullable().unique().primary();
    table.foreign('rdga_number').references('players.rdga_number');
    table.integer('telegram_id').notNullable().unique();
    table.integer('telegram_auth_date').notNullable();
    table.text('telegram_username').notNullable().unique();
    table.text('telegram_first_name').defaultTo('');
    table.text('telegram_last_name').defaultTo('');
    table.text('telegram_photo_url').defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
