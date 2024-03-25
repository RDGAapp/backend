import { Knex } from 'knex';
import { fakerRU as faker } from '@faker-js/faker';
import { IAuthDataDb } from 'types/authDataDb';

const tableName = 'auth_data';

const authDatas: IAuthDataDb[] = [];
const telegramIds: Record<number, Partial<IAuthDataDb>> = {
  24: {
    telegram_id: 201645092,
    telegram_username: 'cherkasik',
  },
};

for (let i = 1; i <= 100; i++) {
  const authData: IAuthDataDb = {
    rdga_number: i,
    telegram_photo_url: faker.image.avatar(),
    telegram_id: telegramIds[i]?.telegram_id ?? i,
    telegram_auth_date: 1,
    telegram_username:
      telegramIds[i]?.telegram_username ?? faker.internet.userName(),
    telegram_first_name: null,
    telegram_last_name: null,
  };
  authDatas.push(authData);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(authDatas);
}
