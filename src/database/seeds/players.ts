import { Knex } from 'knex';

const tableName = 'player';

const players = [
    {
        "name": "Гарри",
        "surname": "Поттер",
        "rdga_number": 1,
        "rdga_rating": 1000,
        "rdga_rating_change": 1000,
        "town": "Годрикова Впадина",
        "email": "harry-potter@hogwarts.com",
        "pdga_number": 1,
        "pdga_rating": 1000,
        "metrix_number": 1,
        "priority": 0
    },
    {
        "name": "Рон",
        "surname": "Уизли",
        "rdga_number": 2,
        "rdga_rating": 1000,
        "rdga_rating_change": 100,
        "town": "Оттери-Сент-Кэчполу",
        "email": "ron-weasley@hogwarts.com",
        "pdga_number": 2,
        "pdga_rating": 800,
        "metrix_number": 2,
        "priority": 0
    },
    {
        "name": "Гермиона",
        "surname": "Грейнджер",
        "rdga_number": 3,
        "rdga_rating": 1000,
        "rdga_rating_change": -100,
        "town": "Лондон",
        "email": "hermione-granger@hogwarts.com",
        "pdga_number": 3,
        "pdga_rating": 900,
        "metrix_number": 3,
        "priority": 0
    }
];

const generateRandomRating = () => Math.floor(Math.random() * 1000);

for (let i = 4; i <= 100; i++) {
    const newTestPlayers = {
        "name": `Test-${i}`,
        "surname": `Generated-${i}`,
        "rdga_number": i,
        "rdga_rating": generateRandomRating(),
        "rdga_rating_change": 0,
        "town": "Town of Generated Testers",
        "email": `test${i}@generated.com`,
        "pdga_number": i,
        "pdga_rating": generateRandomRating(),
        "metrix_number": i,
        "priority": 0
    };
    players.push(newTestPlayers);
}

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(tableName).del();

    // Inserts seed entries
    await knex(tableName).insert(players);
}
