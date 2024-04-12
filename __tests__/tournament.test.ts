import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testTournament from '../src/__tests__/mocks/testTournament';

describe('Tournament endpoints', () => {
  const testTournamentWithoutCode = {
    name: testTournament.name,
    town: testTournament.town,
    startDate: testTournament.startDate,
    endDate: testTournament.endDate,
    tournamentType: testTournament.tournamentType,
    metrixId: testTournament.metrixId,
  };

  const testTournamentResponse = {
    ...testTournament,
    startDate: testTournament.startDate,
    endDate: testTournament.endDate,
  };

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
          startDate: tournamentToCreate.startDate,
          endDate: tournamentToCreate.endDate,
        },
      ]);
    });
  });

  describe('POST /tournaments', () => {
    test('should return 201 and create tournament', async () => {
      const response = await request(app)
        .post('/tournaments')
        .send(testTournament);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Value "Test" created');

      const getAllResponse = await request(app).get('/tournaments');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toEqual([testTournamentResponse]);
    });

    test('should return 500 if tournament already exists', async () => {
      await request(app).post('/tournaments').send(testTournament);
      const response = await request(app)
        .post('/tournaments')
        .send(testTournament);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Something\'s wrong: error: insert into "tournament" ("code", "end_date", "metrix_id", "name", "start_date", "tournament_type", "town") values ($1, $2, $3, $4, $5, $6, $7) returning * - duplicate key value violates unique constraint "tournaments_pkey"',
      );
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app)
        .post('/tournaments')
        .send({ ...testTournament, name: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected string, received number at "name"',
      );
    });
  });

  describe('PUT /tournaments/:tournamentCode', () => {
    beforeEach(async () => {
      await request(app).post('/tournaments').send(testTournament);
    });

    const tournamentToUpdate: Partial<typeof testTournament> = {
      ...testTournamentWithoutCode,
      name: 'test2',
    };

    const tournamentToUpdateResponse = {
      ...testTournamentWithoutCode,
      startDate: testTournamentWithoutCode.startDate,
      endDate: testTournamentWithoutCode.endDate,
      name: 'test2',
    };

    test('should return 200 and update tournament', async () => {
      const response = await request(app)
        .put('/tournaments/test')
        .send(tournamentToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...tournamentToUpdateResponse,
        code: 'test',
      });
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app)
        .put('/tournaments/test')
        .send({ ...tournamentToUpdate, name: 1 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected string, received number at "name"',
      );
    });
  });

  describe('DELETE /tournaments/:tournamentCode', () => {
    test('should return 200 and delete tournament', async () => {
      await request(app).post('/tournaments').send(testTournament);
      const response = await request(app).del('/tournaments/test');

      expect(response.status).toBe(201);
      expect(response.text).toEqual('Value "test" deleted');

      const getResponse = await request(app).get('/tournaments');
      expect(getResponse.body.length).toBe(0);
    });
  });

  describe('GET /tournaments/:tournamentCode', () => {
    test('should return 200 and get tournament', async () => {
      const tournamentToCreate = testTournament;
      await request(app).post('/tournaments').send(tournamentToCreate);
      const response = await request(app).get('/tournaments/test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...tournamentToCreate,
        startDate: tournamentToCreate.startDate,
        endDate: tournamentToCreate.endDate,
      });
    });
  });
});
