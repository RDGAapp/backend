import TournamentType from '../../enums/TournamentType';
import { Knex } from 'knex';

const tableName = 'tournaments';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE "${tableName}"
    DROP CONSTRAINT "tournaments_tournament_type_check",
    ADD CONSTRAINT "tournaments_tournament_type_check" 
    CHECK (tournament_type IN (
      '${TournamentType.AllStar}',
      '${TournamentType.BagTag}',
      '${TournamentType.League}',
      '${TournamentType.National}',
      '${TournamentType.Regional}',
      '${TournamentType.RussianChampionship}',
      '${TournamentType.Federal}',
      '${TournamentType.Pro}'
    ))
  `);

  await knex(tableName)
    .where({ tournament_type: TournamentType.League })
    .update({ tournament_type: TournamentType.Pro });
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName)
    .where({ tournament_type: TournamentType.Pro })
    .update({ tournament_type: TournamentType.League });

  await knex.schema.raw(`
    ALTER TABLE "${tableName}"
    DROP CONSTRAINT "tournaments_tournament_type_check",
    ADD CONSTRAINT "tournaments_tournament_type_check" 
    CHECK (tournament_type IN (
      '${TournamentType.AllStar}',
      '${TournamentType.BagTag}',
      '${TournamentType.League}',
      '${TournamentType.National}',
      '${TournamentType.Regional}',
      '${TournamentType.RussianChampionship}',
      '${TournamentType.Federal}'
    ))
  `);
}
