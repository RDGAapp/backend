import request from 'supertest';
import fetchMock from 'jest-fetch-mock';

import app from '../src/app';
import db from '../src/database';
import testPlayer from '../src/__tests__/mocks/testPlayer';

fetchMock.enableMocks();

describe('Player endpoints', () => {
  const testPlayerResponse = {
    ...testPlayer,
    activeTo: testPlayer.activeTo.toISOString(),
  };

  const nullablePlayer = {
    ...testPlayer,
    surname: null,
    town: null,
    pdgaNumber: null,
    pdgaRating: null,
    metrixNumber: null,
  };

  const nullablePlayerResponse = {
    ...nullablePlayer,
    activeTo: testPlayer.activeTo.toISOString(),
  };

  beforeEach(async () => {
    fetchMock.resetMocks();
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('GET /players', () => {
    test('should return 200 with empty array', async () => {
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

    test('should return 200 sorted by rating and then by number', async () => {
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
        metrixNumber: 3,
        pdgaNumber: 3,
      };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer3, testPlayerResponse, testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        town: 'Somewhere2',
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        town: 'Somewhere2',
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer3, testPlayerResponse, testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer3, testPlayerResponse, testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer3, testPlayerResponse, testPlayer2],
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
      const testPlayer2 = {
        ...testPlayerResponse,
        rdgaNumber: 2,
        metrixNumber: 2,
        pdgaNumber: 2,
        surname: 'User2',
        activeTo: new Date('2000-09-29').toISOString(),
      };
      const testPlayer3 = {
        ...testPlayerResponse,
        rdgaNumber: 3,
        rdgaRating: 10001,
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
        data: [testPlayer3],
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
  });

  describe('GET /players/:rdgaNumber', () => {
    test('should return 200 with player with metrix data', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          [],
          [
            [1, 10, ''],
            [1, 20, ''],
          ],
          [],
        ]),
      );
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixRating: 10,
        metrixRatingChange: -10,
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return 200 with player without metrix data', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([[], [], []]));
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        metrixRating: null,
        metrixRatingChange: null,
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return 200 with player without metrixNumber', async () => {
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
      });
      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    test('should return 404 if player does not exist', async () => {
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(404);
      expect(response.text).toEqual('Игрок с таким номером РДГА не найден');
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app).get('/players/test');

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });
  });

  describe('POST /players', () => {
    test('should return 201 and create player', async () => {
      const response = await request(app).post('/players').send(testPlayer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Игрок с номером РДГА 1 создан');

      const getAllResponse = await request(app).get('/players');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.data).toEqual([testPlayerResponse]);
    });

    test('should return 500 if player already exists', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).post('/players').send(testPlayer);

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Что-то пошло не так: Error: Игрок с таким номером RDGA, PDGA или Metrix уже существует',
      );
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app)
        .post('/players')
        .send({ ...testPlayer, rdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "rdgaNumber" must be a number',
      );
    });

    test('should return 200 and create player with null fields', async () => {
      const response = await request(app).post('/players').send(nullablePlayer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Игрок с номером РДГА 1 создан');

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
      email: 'test1@user.com',
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
        activeTo: playerToUpdate.activeTo?.toISOString(),
      });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .put('/players/test')
        .send(playerToUpdate);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app)
        .put('/players/1')
        .send({ ...playerToUpdate, pdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "pdgaNumber" must be a number',
      );
    });

    test('should return 200 and update player with null fields', async () => {
      const response = await request(app)
        .put('/players/1')
        .send(nullablePlayerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...nullablePlayerToUpdate,
        activeTo: nullablePlayerToUpdate.activeTo?.toISOString(),
        rdgaNumber: 1,
      });
    });
  });

  describe('DELETE /players/:rdgaNumber', () => {
    test('should return 200 and delete player', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).del('/players/1');

      expect(response.status).toBe(200);
      expect(response.text).toEqual('Игрок с номером РДГА 1 удален');

      const getResponse = await request(app).get('/players/1');
      expect(getResponse.status).toBe(404);
    });

    test('should return 500 if player does not exist', async () => {
      const response = await request(app).del('/players/1');

      expect(response.status).toBe(500);
      expect(response.text).toEqual(
        'Что-то пошло не так: Error: Игрока с таким номером РДГА нет в базе',
      );
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app).del('/players/test');

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });
  });

  describe('PATCH /players/:rdgaNumber/rdgaRating', () => {
    test("should return 200 and update player's rating", async () => {
      await request(app).post('/players').send(testPlayer);

      const response = await request(app)
        .patch('/players/1/rdgaRating')
        .send({ rating: 900 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        rdgaRating: 900,
        rdgaRatingChange: -9100,
      });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .patch('/players/test/rdgaRating')
        .send({ rating: 900 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

    test('should return 400 if rating is not a number', async () => {
      const response = await request(app)
        .patch('/players/1/rdgaRating')
        .send({ rating: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "rating" must be a number',
      );
    });

    test('should return 200 and update player with null rating', async () => {
      const playerToCreate: Partial<typeof testPlayer> = { ...testPlayer };
      delete playerToCreate.rdgaRating;

      await request(app)
        .post('/players')
        .send({ ...playerToCreate });

      const response = await request(app)
        .patch('/players/1/rdgaRating')
        .send({ rating: 900 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        rdgaRating: 900,
        rdgaRatingChange: 900,
      });
    });
  });

  describe('PATCH /players/:rdgaNumber/activate', () => {
    test("should return 200 and update player's activeTo", async () => {
      await request(app).post('/players').send(testPlayer);

      const response = await request(app).patch('/players/1/activate').send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...testPlayerResponse,
        activeTo: `${new Date().getFullYear() + 1}-04-01T00:00:00.000Z`,
      });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .patch('/players/test/activate')
        .send();

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });
  });

  describe('PUT /players/rdgaRating/multiple', () => {
    test("should return 200 and update player's rating", async () => {
      await request(app).post('/players').send(testPlayer);

      const response = await request(app)
        .put('/players/rdgaRating/multiple')
        .send([{ rdgaNumber: 1, rating: 900 }]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        errors: [],
        updatedPlayers: [
          {
            ...testPlayerResponse,
            rdgaRating: 900,
            rdgaRatingChange: -9100,
          },
        ],
      });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app)
        .put('/players/rdgaRating/multiple')
        .send([{ rdgaNumber: 'some', rating: 900 }]);

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "[0].rdgaNumber" must be a number',
      );
    });

    test('should return 400 if rating is not a number', async () => {
      const response = await request(app)
        .put('/players/rdgaRating/multiple')
        .send([{ rdgaNumber: 1, rating: 'some' }]);

      expect(response.status).toBe(400);
      expect(response.text).toEqual(
        'Проверьте данные: "[0].rating" must be a number',
      );
    });

    test('should return 200 and update player with null rating', async () => {
      const playerToCreate: Partial<typeof testPlayer> = { ...testPlayer };
      delete playerToCreate.rdgaRating;

      await request(app).post('/players').send(playerToCreate);

      const response = await request(app)
        .put('/players/rdgaRating/multiple')
        .send([{ rdgaNumber: 1, rating: 900 }]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        errors: [],
        updatedPlayers: [
          {
            ...testPlayerResponse,
            rdgaRating: 900,
            rdgaRatingChange: 900,
          },
        ],
      });
    });
  });
});
