import { Knex } from 'knex';
import { Table } from '../../types/db';

const tableName = Table.PlayerRoles;

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert({ player_rdga_number: 24, role_code: 'su' });
}
