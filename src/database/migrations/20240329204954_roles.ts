import type { Knex } from 'knex';

const roleTableName = 'role';
const joinTableName = 'player_roles';
const playersTableName = 'player';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(roleTableName, (table) => {
    table.text('code').notNullable().unique().primary();
    table.text('name').notNullable();
    table.boolean('can_manage_players').notNullable().defaultTo(false);
    table.boolean('can_manage_tournaments').notNullable().defaultTo(false);
    table.boolean('can_manage_blog_post').notNullable().defaultTo(false);
    table.boolean('can_manage_blog_posts').notNullable().defaultTo(false);
    table.boolean('can_manage_roles').notNullable().defaultTo(false);
    table.boolean('can_assign_roles').notNullable().defaultTo(false);
  });

  // basic roles
  await knex(roleTableName).insert({
    code: 'su',
    name: 'SuperUser',
    can_manage_players: true,
    can_manage_tournaments: true,
    can_manage_blog_post: true,
    can_manage_blog_posts: true,
    can_manage_roles: true,
    can_assign_roles: true,
  });
  await knex(roleTableName).insert({
    code: 'admin',
    name: 'Administrator',
    can_manage_players: true,
    can_manage_tournaments: true,
    can_manage_blog_post: true,
    can_manage_blog_posts: true,
  });
  await knex(roleTableName).insert({
    code: 'author',
    name: 'Author',
    can_manage_blog_post: true,
  });

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
