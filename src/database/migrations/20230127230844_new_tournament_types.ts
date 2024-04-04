import { Knex } from 'knex';

const tableName = 'tournaments';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE "${tableName}"
    DROP CONSTRAINT "tournaments_tournament_type_check",
    ADD CONSTRAINT "tournaments_tournament_type_check" 
    CHECK (tournament_type IN (
      'МВЗ',
      'bag-tag',
      'лига',
      'национальный тур',
      'региональный',
      'ЧР',
      'федеральный'
    ))
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE "${tableName}"
    DROP CONSTRAINT "tournaments_tournament_type_check",
    ADD CONSTRAINT "tournaments_tournament_type_check" 
    CHECK (tournament_type IN (
      'МВЗ',
      'bag-tag',
      'лига',
      'национальный тур',
      'региональный'
    ))
  `);
}
