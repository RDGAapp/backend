import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testPost from '../src/__tests__/mocks/testPost';
import testPlayer from '../src/__tests__/mocks/testPlayer';

describe('Post endpoints', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const testPostWithoutCreatedAt = {
    code: testPost.code,
    header: testPost.header,
    text: testPost.text,
    author: testPost.author,
    authorRdgaNumber: testPlayer.rdgaNumber,
  };

  const testPostWithoutCode = {
    header: testPost.header,
    text: testPost.text,
    author: testPost.author,
    createdAt: testPost.createdAt,
    authorRdgaNumber: testPlayer.rdgaNumber,
  };

  const responseTestPost = {
    ...testPost,
    authorAvatarUrl: null,
    authorName: 'Test',
    authorSurname: 'User',
  };

  describe('GET /posts', () => {
    test('should return 200 with empty array', async () => {
      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 0,
          perPage: 10,
          to: 0,
          total: 0,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 with someData', async () => {
      const postToCreate = testPostWithoutCreatedAt;
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/posts').send(postToCreate);

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            ...responseTestPost,
            createdAt: new Date().toISOString(),
          },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 10,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 with sorted values by createdAt', async () => {
      const postToCreate = testPostWithoutCreatedAt;
      await request(app).post('/players').send(testPlayer);
      jest.useFakeTimers().setSystemTime(new Date('2010-01-01'));
      await request(app).post('/posts').send(postToCreate);
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      await request(app)
        .post('/posts')
        .send({ ...postToCreate, code: 'test2' });

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            ...responseTestPost,
            code: 'test2',
            createdAt: new Date().toISOString(),
          },
          {
            ...responseTestPost,
            createdAt: new Date('2010-01-01').toISOString(),
          },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 10,
          to: 2,
          total: 2,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should filter by createdAt', async () => {
      const postToCreate = testPostWithoutCreatedAt;
      await request(app).post('/players').send(testPlayer);
      jest.useFakeTimers().setSystemTime(new Date('2010-01-01'));
      await request(app).post('/posts').send(postToCreate);
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
      await request(app)
        .post('/posts')
        .send({ ...postToCreate, code: 'test2' });

      const response = await request(app).get(
        '/posts?from=2010-01-01T00:00:00.000Z',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          {
            ...responseTestPost,
            createdAt: new Date('2010-01-01').toISOString(),
          },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 10,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });
  });

  describe('POST /posts', () => {
    test('should return 201 and create post', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app)
        .post('/posts')
        .send(testPostWithoutCreatedAt);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Пост "Обновление сайта" создан');

      const getAllResponse = await request(app).get('/posts');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toEqual({
        data: [
          {
            ...responseTestPost,
            createdAt: new Date().toISOString(),
          },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 10,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 500 if tournament already exists', async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
      const response = await request(app)
        .post('/posts')
        .send(testPostWithoutCreatedAt);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Something\'s wrong: error: insert into "post" ("author", "author_rdga_number", "code", "created_at", "header", "text") values ($1, $2, $3, $4, $5, $6) returning * - duplicate key value violates unique constraint "posts_pkey"',
      );
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ ...testPostWithoutCreatedAt, header: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected string, received number at "header"',
      );
    });
  });

  describe('PUT /posts/:postCode', () => {
    beforeEach(async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
    });

    const postToUpdate: Partial<typeof testPostWithoutCode> = {
      ...testPostWithoutCode,
      header: 'test2',
    };

    test('should return 200 and update tournament', async () => {
      const response = await request(app)
        .put('/posts/site_update_1')
        .send(postToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...postToUpdate,
        code: testPost.code,
      });
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app)
        .put('/posts/test')
        .send({ ...testPostWithoutCode, header: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected string, received number at "header"',
      );
    });
  });

  describe('DELETE /posts/:postCode', () => {
    test('should return 200 and delete post', async () => {
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
      const response = await request(app).del('/posts/site_update_1');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Пост site_update_1 удален');

      const getResponse = await request(app).get('/posts');
      expect(getResponse.body.data.length).toBe(0);
    });
  });

  describe('GET /posts/:postCode', () => {
    test('should return 200 and get tournament', async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
      const response = await request(app).get('/posts/site_update_1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...responseTestPost,
        createdAt: new Date().toISOString(),
      });
    });
  });
});
