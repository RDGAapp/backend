import SportsCategory from 'enums/SportsCategory';
import { Knex } from 'knex';
import { IPlayerDb } from 'types/playerDb';

const tableName = 'player';

const players: IPlayerDb[] = [
  {
    name: 'Гарри',
    surname: 'Поттер',
    rdga_number: 1,
    rdga_rating: 1000,
    rdga_rating_change: 1000,
    town: 'Годрикова Впадина',
    pdga_number: 1,
    metrix_number: 1,
    priority: 0,
    active_to: new Date(2025, 0, 1).toISOString(),
    sports_category: SportsCategory.Master,
  },
  {
    name: 'Рон',
    surname: 'Уизли',
    rdga_number: 2,
    rdga_rating: 1000,
    rdga_rating_change: 100,
    town: 'Оттери-Сент-Кэчполу',
    pdga_number: 2,
    metrix_number: 2,
    priority: 0,
    active_to: new Date(2025, 0, 1).toISOString(),
    sports_category: SportsCategory.AdultFirst,
  },
  {
    name: 'Гермиона',
    surname: 'Грейнджер',
    rdga_number: 3,
    rdga_rating: 1000,
    rdga_rating_change: -100,
    town: 'Лондон',
    pdga_number: 3,
    metrix_number: 3,
    priority: 0,
    active_to: new Date(2025, 0, 1).toISOString(),
    sports_category: SportsCategory.Candidate,
  },
];

const generateRandomRating = () => Math.floor(Math.random() * 1000);

for (let i = 4; i <= 100; i++) {
  const newTestPlayers: IPlayerDb = {
    name: `Test-${i}`,
    surname: `Generated-${i}`,
    rdga_number: i,
    rdga_rating: generateRandomRating(),
    rdga_rating_change: 0,
    town: 'Town of Generated Testers',
    pdga_number: i,
    metrix_number: i,
    priority: 0,
    active_to: new Date(2025, 0, 1).toISOString(),
    sports_category: null,
  };
  players.push(newTestPlayers);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(players);
}
