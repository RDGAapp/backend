import request from 'supertest';
import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import { mock as fetchMock, clearMocks as clearFetchMock } from 'bun-bagel';

import app from '../src/app';
import db from '../src/database';
import testPlayer from '../src/__tests__/mocks/testPlayer';
import { SportsCategory } from '../src/types/db';
import { clearRdgaDataCache } from '../src/helpers/externalApiHelpers';

describe('Player endpoints', () => {
  const testPlayerResponse = {
    ...testPlayer,
    avatarUrl: null,
    rdgaRating: 0,
    rdgaRatingChange: null,
  };

  const nullablePlayer = {
    ...testPlayer,
    surname: null,
    town: null,
    pdgaNumber: null,
    metrixNumber: null,
  };

  const nullablePlayerResponse = {
    ...nullablePlayer,
    avatarUrl: null,
    activeTo: testPlayer.activeTo,
    rdgaRating: 0,
    rdgaRatingChange: null,
  };

  beforeEach(async () => {
    clearFetchMock();
    clearRdgaDataCache();
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('GET /players', () => {
    test('should return 200 with empty array', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 0,
          perPage: 30,
          to: 0,
          total: 0,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 with someData', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayerResponse],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 sorted by number', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          testPlayerResponse,
          { ...testPlayerResponse, ...testPlayer2 },
          { ...testPlayerResponse, ...testPlayer3 },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 3,
          total: 3,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 filtered by city', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        town: 'Somewhere2',
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        town: 'Somewhere3',
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?town=Somewhere2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [{ ...testPlayerResponse, ...testPlayer2 }],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200, filter by city and not drop table', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        town: 'Somewhere2',
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        town: 'Somewhere3',
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get(
        '/players?town=DROP+TABLE+players',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 0,
          perPage: 30,
          to: 0,
          total: 0,
          nextPage: null,
          prevPage: null,
        },
      });

      const responseAll = await request(app).get('/players');
      expect(responseAll.status).toBe(200);
      expect(responseAll.body).toEqual({
        data: [
          testPlayerResponse,
          { ...testPlayerResponse, ...testPlayer2 },
          { ...testPlayerResponse, ...testPlayer3 },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 3,
          total: 3,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 filtered by surname part', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        surname: 'User3',
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?surname=2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [{ ...testPlayerResponse, ...testPlayer2 }],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 ignore case for surname', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        surname: 'User3',
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?surname=SER');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          testPlayerResponse,
          { ...testPlayerResponse, ...testPlayer2 },
          { ...testPlayerResponse, ...testPlayer3 },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 3,
          total: 3,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200, filter by surname and not drop table', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        surname: 'User3',
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get(
        '/players?surname=DROP+TABLE+players',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 0,
          perPage: 30,
          to: 0,
          total: 0,
          nextPage: null,
          prevPage: null,
        },
      });

      const responseAll = await request(app).get('/players');
      expect(responseAll.status).toBe(200);
      expect(responseAll.body).toEqual({
        data: [
          testPlayerResponse,
          { ...testPlayerResponse, ...testPlayer2 },
          { ...testPlayerResponse, ...testPlayer3 },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 3,
          total: 3,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 onlyActive members', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
        activeTo: new Date('2000-09-29').toISOString(),
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
        surname: 'User3',
        activeTo: new Date('3000-09-29').toISOString(),
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      const response = await request(app).get('/players?onlyActive=true');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [{ ...testPlayerResponse, ...testPlayer3 }],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 1,
          total: 1,
          nextPage: null,
          prevPage: null,
        },
      });
    });

    test('should return 200 with rdga rating info', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [
          { rdgaNumber: 1, rating: 100, diff: 10 },
          { rdgaNumber: 2, rating: 200, diff: 20 },
          { rdgaNumber: 3, rating: 300, diff: 30 },
        ],
      });
      const testPlayer2 = {
        ...testPlayer,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
      };
      const testPlayer3 = {
        ...testPlayer,
        rdgaNumber: 3,
        metrixNumber: 3,
        pdgaNumber: 3,
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [
          { ...testPlayerResponse, rdgaRating: 100, rdgaRatingChange: 10 },
          {
            ...testPlayerResponse,
            ...testPlayer2,
            rdgaRating: 200,
            rdgaRatingChange: 20,
          },
          {
            ...testPlayerResponse,
            ...testPlayer3,
            rdgaRating: 300,
            rdgaRatingChange: 30,
          },
        ],
        pagination: {
          currentPage: 1,
          from: 0,
          lastPage: 1,
          perPage: 30,
          to: 3,
          total: 3,
          nextPage: null,
          prevPage: null,
        },
      });
    });
  });

  describe('GET /players/:rdgaNumber', () => {
    test('should return 200 with player with metrix data', async () => {
      fetchMock(
        'https://discgolfmetrix.com/mystat_server_rating.php?user_id=1&other=1&course_id=0',
        {
          data: [
            [],
            [
              [1, 10, ''],
              [1, 20, ''],
            ],
            [],
          ],
        },
      );
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, pdgaNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixRating: 10,
        metrixRatingChange: -10,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
      });
    });

    test('should return 200 with player without metrix data', async () => {
      fetchMock(
        'https://discgolfmetrix.com/mystat_server_rating.php?user_id=1&other=1&course_id=0',
        { data: [[], [], []] },
      );
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, pdgaNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
      });
    });

    test('should return 200 with player with pdga data', async () => {
      fetchMock('https://www.pdga.com/player/1', {
        data: '<html><small>(test text 31-Dec-2024)</small><strong>Current Rating:</strong> 955</html><a title="some info">+21</a>',
      });
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, metrixNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: 955,
        pdgaRatingChange: 21,
        pdgaActiveTo: new Date('31-Dec-2024').toISOString(),
      });
    });

    test('should return 200 with player without pdga data', async () => {
      fetchMock('https://www.pdga.com/player/1', { data: '<html></html>' });
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, metrixNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
      });
    });

    test('should return 200 with player with rdga data', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [{ rdgaNumber: 1, rating: 500, diff: -10 }],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, metrixNumber: null, pdgaNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
        rdgaRating: 500,
        rdgaRatingChange: -10,
      });
    });

    test('should return 200 with player without metrixNumber and pdgaNumber', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({ ...testPlayer, metrixNumber: null, pdgaNumber: null });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
      });
    });

    test('should return 200 with player with SportsCategory', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      await request(app)
        .post('/players')
        .send({
          ...testPlayer,
          metrixNumber: null,
          pdgaNumber: null,
          sportsCategory: SportsCategory.JuniorThird,
        });
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaRatingChange: null,
        pdgaActiveTo: null,
        sportsCategory: SportsCategory.JuniorThird,
      });
    });

    test('should return 404 if player does not exist', async () => {
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(404);
      expect(response.text).toEqual('Not found');
    });

    test('should return 500 if rdgaNumber is not a number', async () => {
      const response = await request(app).get('/players/test');

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('POST /players', () => {
    test('should return 201 and create player', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const response = await request(app).post('/players').send(testPlayer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Value "1" created');

      const getAllResponse = await request(app).get('/players');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.data).toEqual([testPlayerResponse]);
    });

    test('should return 500 if player already exists', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).post('/players').send(testPlayer);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Something\'s wrong: error: insert into "player" ("active_to", "metrix_number", "name", "pdga_number", "rdga_number", "sports_category", "surname", "town") values ($1, $2, $3, $4, $5, $6, $7, $8) returning * - duplicate key value violates unique constraint "player_pkey"',
      );
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app)
        .post('/players')
        .send({ ...testPlayer, rdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected number, received string at "rdgaNumber"',
      );
    });

    test('should return 200 and create player with null fields', async () => {
      fetchMock('https://rdga-api-astrogator.amvera.io/api/actual_rating', {
        data: [],
      });
      const response = await request(app).post('/players').send(nullablePlayer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Value "1" created');

      const getAllResponse = await request(app).get('/players');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.data).toEqual([nullablePlayerResponse]);
    });
  });

  describe('PUT /players/:rdgaNumber', () => {
    beforeEach(async () => {
      await request(app).post('/players').send(testPlayer);
    });

    const playerToUpdate: Partial<typeof testPlayer> = {
      ...testPlayer,
      name: 'Test2',
    };
    delete playerToUpdate.rdgaNumber;

    const nullablePlayerToUpdate: Partial<typeof testPlayer> = {
      ...nullablePlayer,
      name: 'Test1',
    };
    delete nullablePlayerToUpdate.rdgaNumber;

    test('should return 200 and update player', async () => {
      const response = await request(app)
        .put('/players/1')
        .send(playerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...playerToUpdate,
        rdgaNumber: 1,
        activeTo: playerToUpdate.activeTo,
      });
    });

    test('should return 500 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .put('/players/test')
        .send(playerToUpdate);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        "Something's wrong: Error: No primary key value provided",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app)
        .put('/players/1')
        .send({ ...playerToUpdate, pdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Validation error: Expected number, received string at "pdgaNumber"',
      );
    });

    test('should return 200 and update player with null fields', async () => {
      const response = await request(app)
        .put('/players/1')
        .send(nullablePlayerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...nullablePlayerToUpdate,
        activeTo: nullablePlayerToUpdate.activeTo,
        rdgaNumber: 1,
      });
    });
  });

  describe('DELETE /players/:rdgaNumber', () => {
    test('should return 201 and delete player', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).del('/players/1');

      expect(response.status).toBe(201);
      expect(response.text).toEqual('Value "1" deleted');

      const getResponse = await request(app).get('/players/1');
      expect(getResponse.status).toBe(404);
    });

    test('should return 201 even if player does not exist', async () => {
      const response = await request(app).del('/players/1');

      expect(response.status).toBe(201);
      expect(response.text).toEqual('Value "1" deleted');
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app).del('/players/test');

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('PATCH /players/:rdgaNumber/activate', () => {
    test("should return 200 and update player's activeTo", async () => {
      await request(app).post('/players').send(testPlayer);

      const response = await request(app).patch('/players/1/activate').send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayer,
        activeTo: `${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`,
      });
    });

    test('should return 500 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .patch('/players/test/activate')
        .send();

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('GET /players/:rdgaNumber/permissions', () => {
    test('should return 200 with all false permissions', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1/permissions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        canManagePlayers: false,
        canManageTournaments: false,
        canManageBlogPost: false,
        canManageBlogPosts: false,
        canManageRoles: false,
        canAssignRoles: false,
      });
    });

    test('should return 200 with someData', async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/players/1/roles').send(['su']);

      const response = await request(app).get('/players/1/permissions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        canManagePlayers: true,
        canManageTournaments: true,
        canManageBlogPost: true,
        canManageBlogPosts: true,
        canManageRoles: true,
        canAssignRoles: true,
      });
    });
  });

  describe('GET /players/:rdgaNumber/roles', () => {
    test('should return 200 with empty array', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1/roles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return 200 with someData', async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/players/1/roles').send(['su']);

      const response = await request(app).get('/players/1/roles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          canManagePlayers: true,
          canManageTournaments: true,
          canManageBlogPost: true,
          canManageBlogPosts: true,
          canManageRoles: true,
          canAssignRoles: true,
          code: 'su',
          name: 'SuperUser',
          playerRdgaNumber: 1,
          roleCode: 'su',
        },
      ]);
    });
  });

  describe('POST /players/:rdgaNumber/roles', () => {
    test('should return 200', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).post('/players/1/roles').send(['su']);

      expect(response.status).toBe(201);
      expect(response.text).toEqual('Value "su" added');
    });
  });

  describe('DELETE /players/:rdgaNumber/roles', () => {
    test('should return 200 with someData', async () => {
      await request(app).post('/players').send(testPlayer);
      await request(app).post('/players/1/roles').send(['su']);
      const responseDel = await request(app)
        .del('/players/1/roles')
        .send(['su']);

      expect(responseDel.status).toBe(201);
      expect(responseDel.text).toBe('Value "su" removed');

      const response = await request(app).get('/players/1/roles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
