import type { Knex } from 'knex';

const roleTableName = 'roles';
const joinTableName = 'user_roles';
const playersTableName = 'player';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(roleTableName, (table) => {
    table.text('code').notNullable().unique().primary();
    table.text('name').notNullable();
  });

  // basic roles
  await knex(roleTableName).insert({ code: 'su', name: 'SuperUser' });
  await knex(roleTableName).insert({ code: 'admin', name: 'Administrator' });
  await knex(roleTableName).insert({ code: 'author', name: 'Author' });

  await knex.schema.createTable(joinTableName, (table) => {
    table.increments('id').notNullable().unique().primary();
    table.integer('player_rdga_number').notNullable();
    table.text('role_code').notNullable();
    table
      .foreign('player_rdga_number')
      .references(`${playersTableName}.rdga_number`);
    table.foreign('role_code').references(`${roleTableName}.code`);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(joinTableName);
  await knex.schema.dropTable(roleTableName);
}
