import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import { fullTelegramUser } from '../src/__tests__/mocks/telegramUsers';

describe('Authorization endpoints', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('POST /login', () => {
    // TODO: positive e2e test

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
});
