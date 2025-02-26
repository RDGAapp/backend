import { SportsCategory, Table } from '../../types/db';
import { Knex } from 'knex';
import { IPlayerDb } from '../../types/playerDb';
import { fakerRU as faker } from '@faker-js/faker';

const tableName = Table.Player;
const now = new Date();

const players: IPlayerDb[] = [];
const notActiveRdgaNumbers = [82, 63, 29, 47, 30, 29];

for (let i = 1; i <= 100; i++) {
  const sex = faker.person.sexType();

  const player: IPlayerDb = {
    name: faker.person.firstName(sex),
    surname: faker.person.lastName(sex),
    rdga_number: i,
    town: faker.location.city(),
    pdga_number: faker.number.int({ min: 0, max: 1_000_000 }),
    metrix_number: faker.number.int({ min: 0, max: 1_000_000 }),
    active_to: notActiveRdgaNumbers.includes(i)
      ? new Date(now.getFullYear() - 1, 0, 1).toISOString()
      : new Date(now.getFullYear() + 1, 0, 1).toISOString(),
    sports_category: notActiveRdgaNumbers.includes(i)
      ? null
      : faker.helpers.enumValue(SportsCategory),
  };
  players.push(player);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(players);
}
