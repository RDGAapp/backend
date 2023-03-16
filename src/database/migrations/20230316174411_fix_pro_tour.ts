import TournamentType from '../../enums/TournamentType';
import { Knex } from 'knex';

const tableName = 'tournaments';

export async function up(knex: Knex): Promise<void> {
  await knex(tableName)
    .where({ tournament_type: TournamentType.Pro })
    .update({ tournament_type: TournamentType.League });

  await knex(tableName)
    .where({ tournament_type: TournamentType.National })
    .update({ tournament_type: TournamentType.Pro });
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName)
    .where({ tournament_type: TournamentType.Pro })
    .update({ tournament_type: TournamentType.National });

  await knex(tableName)
    .where({ tournament_type: TournamentType.League })
    .update({ tournament_type: TournamentType.Pro });
}
