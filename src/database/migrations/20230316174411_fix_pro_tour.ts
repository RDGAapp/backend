import { Knex } from 'knex';

const tableName = 'tournaments';

export async function up(knex: Knex): Promise<void> {
  await knex(tableName)
    .where({ tournament_type: 'про тур' })
    .update({ tournament_type: 'лига' });

  await knex(tableName)
    .where({ tournament_type: 'национальный тур' })
    .update({ tournament_type: 'про тур' });
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName)
    .where({ tournament_type: 'про тур' })
    .update({ tournament_type: 'национальный тур' });

  await knex(tableName)
    .where({ tournament_type: 'лига' })
    .update({ tournament_type: 'про тур' });
}
