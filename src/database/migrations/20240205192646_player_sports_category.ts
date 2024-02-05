import SportsCategory from '../../enums/SportsCategory';
import type { Knex } from 'knex';

const tableName = 'players';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table
      .enum('sports_category', [
        SportsCategory.Master,
        SportsCategory.Candidate,
        SportsCategory.AdultFirst,
        SportsCategory.AdultSecond,
        SportsCategory.AdultThird,
        SportsCategory.JuniorFirst,
        SportsCategory.JuniorSecond,
        SportsCategory.JuniorThird,
      ])
      .nullable()
      .defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn('sports_category');
  });
}
