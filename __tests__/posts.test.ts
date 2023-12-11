import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testPost from '../src/__tests__/mocks/testPost';

describe('Posts endpoints', () => {
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
  };

  const testPostWithoutCode = {
    header: testPost.header,
    text: testPost.text,
    author: testPost.author,
  };

  describe('GET /posts', () => {
    test('should return 200 with empty array', async () => {
      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return 200 with someData', async () => {
      const postToCreate = testPostWithoutCreatedAt;
      await request(app).post('/posts').send(postToCreate);

      const response = await request(app).get('/posts');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          ...testPost,
          createdAt: new Date().toISOString(),
        },
      ]);
    });
  });

  describe('POST /posts', () => {
    test('should return 201 and create post', async () => {
      const response = await request(app)
        .post('/posts')
        .send(testPostWithoutCreatedAt);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Пост "Обновление сайта" создан');

      const getAllResponse = await request(app).get('/posts');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toEqual([
        {
          ...testPost,
          createdAt: new Date().toISOString(),
        },
      ]);
    });

    test('should return 500 if tournament already exists', async () => {
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
      const response = await request(app)
        .post('/posts')
        .send(testPostWithoutCreatedAt);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Что-то пошло не так: error: insert into "posts" ("author", "code", "created_at", "header", "text") values ($1, $2, $3, $4, $5) returning "header" - duplicate key value violates unique constraint "posts_pkey"',
      );
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ ...testPostWithoutCreatedAt, header: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "header" must be a string',
      );
    });
  });

  describe('PUT /posts/:postCode', () => {
    beforeEach(async () => {
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
        createdAt: new Date().toISOString(),
      });
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app)
        .put('/posts/test')
        .send({ ...testPostWithoutCode, header: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "header" must be a string',
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
      expect(getResponse.body.length).toBe(0);
    });
  });

  describe('GET /posts/:postCode', () => {
    test('should return 200 and get tournament', async () => {
      await request(app).post('/posts').send(testPostWithoutCreatedAt);
      const response = await request(app).get('/posts/site_update_1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPostWithoutCreatedAt,
        createdAt: new Date().toISOString(),
      });
    });
  });
});
