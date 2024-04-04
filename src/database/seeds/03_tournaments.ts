import { Knex } from 'knex';
import { fakerRU as faker } from '@faker-js/faker';
import { ITournamentDb } from '../../types/tournamentDb';
import { Table, TournamentType } from '../../types/db';

const tableName = Table.Tournament;
const now = new Date();

const tournaments: ITournamentDb[] = [];

for (let i = 1; i <= 100; i++) {
  const tournamentName = faker.company.name();
  const tournamentStartDate = faker.date.between({
    from: new Date(now.getFullYear(), 0, 1),
    to: new Date(now.getFullYear() + 1, 0, 1),
  });
  const tournamentEndDate = new Date(tournamentStartDate);
  tournamentEndDate.setDate(tournamentEndDate.getDate() + 3);

  const tournament: ITournamentDb = {
    code: faker.string.fromCharacters(tournamentName) + i,
    name: tournamentName,
    town: faker.location.city(),
    start_date: tournamentStartDate.toISOString(),
    end_date: tournamentEndDate.toISOString(),
    tournament_type: faker.helpers.arrayElement([
      TournamentType.RussianChampionship,
      TournamentType.Pro,
      TournamentType.League,
    ]),
    metrix_id: faker.number.int({ min: 1_000, max: 1_000_000 }).toString(),
  };
  tournaments.push(tournament);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(tournaments);
}
