import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testTournament from '../src/__tests__/mocks/testTournament';

describe('Tournaments endpoints', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('GET /tournaments', () => {
    test('should return 200 with empty array', async () => {
      const response = await request(app).get('/tournaments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return 200 with someData', async () => {
      const tournamentToCreate = testTournament;
      await request(app).post('/tournaments').send(tournamentToCreate);

      const response = await request(app).get('/tournaments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          ...tournamentToCreate,
          startDate: tournamentToCreate.startDate.toISOString(),
          endDate: tournamentToCreate.endDate.toISOString(),
        },
      ]);
    });
  });
});
