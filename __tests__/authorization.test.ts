import request from 'supertest';
import fetchMock from 'jest-fetch-mock';
import app from '../src/app';
import db from '../src/database';
import { fullTelegramUser } from '../src/__tests__/mocks/telegramUsers';
import testPlayer from '../src/__tests__/mocks/testPlayer';

fetchMock.enableMocks();

describe('Authorization endpoints', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('POST /register', () => {
    test('should return 200', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await request(app).post('/players').send(testPlayer);

      const response = await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        rdgaNumber: 1,
        avatarUrl: fullTelegramUser.photo_url,
      });
    });

    test('should return 400 rdgaNumber is corrupted', async () => {
      const response = await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 'broken' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('RDGA number is incorrect or not defined');
    });

    test('should return 400 corrupted data', async () => {
      const response = await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, id: 'test', rdgaNumber: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected number, received string at "id"',
      );
    });

    test('should return 400 corrupted hash', async () => {
      const response = await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, hash: 'broken', rdgaNumber: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Your data is corrupted');
    });

    test("should return 500 if player doesn't exist", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      const response = await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        "Something's wrong: Error: Player doesn't exist",
      );
    });
  });

  describe('POST /login', () => {
    test('should return 200', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await request(app).post('/players').send(testPlayer);
      await request(app)
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });

      const response = await request(app)
        .post('/authorization/login')
        .send(fullTelegramUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        rdgaNumber: 1,
        avatarUrl: fullTelegramUser.photo_url,
      });
    });

    test('should return 404', async () => {
      const response = await request(app)
        .post('/authorization/login')
        .send(fullTelegramUser);

      expect(response.status).toBe(404);
      expect(response.text).toEqual('No such authorization');
    });

    test('should return 400 corrupted hash', async () => {
      const response = await request(app)
        .post('/authorization/login')
        .send({ ...fullTelegramUser, hash: 'broken' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Your data is corrupted');
    });

    test('should return 400 corrupted data', async () => {
      const response = await request(app)
        .post('/authorization/login')
        .send({ ...fullTelegramUser, id: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected number, received string at "id"',
      );
    });
  });

  describe('GET /logout', () => {
    test('should return 200', async () => {
      const agent = request.agent(app);

      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await agent.post('/players').send(testPlayer);
      await agent
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });

      const authorizeResponse1 = await agent.get('/authorization/authorize');
      expect(authorizeResponse1.status).toBe(200);

      const response = await agent.get('/authorization/logout');
      expect(response.status).toBe(200);

      const authorizeResponse2 = await agent.get('/authorization/authorize');
      expect(authorizeResponse2.status).toBe(401);
    });
  });

  describe('GET /authorize', () => {
    test('should return 200 after register', async () => {
      const agent = request.agent(app);

      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await agent.post('/players').send(testPlayer);
      await agent
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });

      const response = await agent.get('/authorization/authorize');
      expect(response.status).toBe(200);
    });

    test('should return 200 after login', async () => {
      const agent = request.agent(app);

      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await agent.post('/players').send(testPlayer);
      await agent
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });
      await agent.get('/authorization/logout');
      await agent.post('/authorization/login').send(fullTelegramUser);

      const response = await agent.get('/authorization/authorize');
      expect(response.status).toBe(200);
    });

    test('should return 401 after logout', async () => {
      const agent = request.agent(app);

      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );

      await agent.post('/players').send(testPlayer);
      await agent
        .post('/authorization/register')
        .send({ ...fullTelegramUser, rdgaNumber: 1 });
      await agent.get('/authorization/logout');

      const response = await agent.get('/authorization/authorize');
      expect(response.status).toBe(401);
    });
  });
});
