import TournamentType from 'enums/TournamentType';
import { Knex } from 'knex';

const tableName = 'tournaments';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.string('code').notNullable().unique().primary();
    table.string('name').notNullable();
    table.string('town').notNullable();
    table.dateTime('start_date').notNullable();
    table.dateTime('end_date').notNullable();
    table
      .enum('tournament_type', [
        TournamentType.AllStar,
        TournamentType.BagTag,
        TournamentType.League,
        TournamentType.National,
        TournamentType.Regional,
      ])
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
