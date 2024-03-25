import { Knex } from 'knex';
import { fakerRU as faker } from '@faker-js/faker';
import { IBlogPostDb } from 'types/postDb';

const tableName = 'posts';

const posts: IBlogPostDb[] = [];

for (let i = 1; i <= 100; i++) {
  const header = faker.lorem.sentence();

  const post: IBlogPostDb = {
    code: faker.string.fromCharacters(header) + i,
    author: faker.internet.userName(),
    header,
    text: faker.lorem.text(),
    created_at: faker.date.past().toISOString(),
    author_rdga_number: faker.number.int({ min: 1, max: 100 }),
  };
  posts.push(post);
}

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex(tableName).del();

  // Inserts seed entries
  await knex(tableName).insert(posts);
}
