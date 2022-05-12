import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testPlayer from '../src/__tests__/mocks/testPlayer';

describe('Player endpoints', () => {
  const nullablePlayer = {
    ...testPlayer,
    surname: null,
    town: null,
    pdgaNumber: null,
    pdgaRating: null,
    metrixNumber: null,
    metrixRating: null,
  };

  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('GET /players', () => {
    test('should return 200 with empty array', async () => {
      const response = await request(app).get('/players');
      console.log(response.text);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: { currentPage: 1, from: 0, lastPage: 0, perPage: 15, to: 0, total: 0 }
      });
    });

    test('should return 200 with someData', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 1, total: 1 }
      });
    });

    test('should return 200 sorted by rating and then by number', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2 };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3 };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer3, testPlayer, testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 3, total: 3 }
      });
    });

    test('should return 200 filtered by city', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2, town: 'Somewhere2' };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3, town: 'Somewhere3' };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?town=Somewhere2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 1, total: 1 }
      });
    });

    test('should return 200, filter by city and not drop table', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2, town: 'Somewhere2' };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3, town: 'Somewhere3' };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?town=DROP+TABLE+players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: { currentPage: 1, from: 0, lastPage: 0, perPage: 15, to: 0, total: 0 }
      });

      const responseAll = await request(app).get('/players');
      expect(responseAll.status).toBe(200);
      expect(responseAll.body).toEqual({
        data: [testPlayer3, testPlayer, testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 3, total: 3 }
      });
    });

    test('should return 200 filtered by surname part', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2, surname: 'User2' };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3, surname: 'User3' };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?surname=2');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 1, total: 1 }
      });
    });

    test('should return 200 ignore case for surname', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2, surname: 'User2' };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3, surname: 'User3' };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?surname=SER');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [testPlayer3, testPlayer, testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 3, total: 3 }
      });
    });

    test('should return 200, filter by surname and not drop table', async () => {
      const testPlayer2 = { ...testPlayer, rdgaNumber: 2, metrixNumber: 2, pdgaNumber: 2, surname: 'User2' };
      const testPlayer3 = { ...testPlayer, rdgaNumber: 3, rdgaRating: 10001, metrixNumber: 3, pdgaNumber: 3, surname: 'User3' };
      await request(app).post('/players').send(testPlayer2);
      await request(app).post('/players').send(testPlayer3);
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players?surname=DROP+TABLE+players');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: [],
        pagination: { currentPage: 1, from: 0, lastPage: 0, perPage: 15, to: 0, total: 0 }
      });

      const responseAll = await request(app).get('/players');
      expect(responseAll.status).toBe(200);
      expect(responseAll.body).toEqual({
        data: [testPlayer3, testPlayer, testPlayer2],
        pagination: { currentPage: 1, from: 0, lastPage: 1, perPage: 15, to: 3, total: 3 }
      });
    });
  });

  describe('GET /players/:rdgaNumber', () => {
    test('should return 200 with player', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(testPlayer);
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
      expect(getAllResponse.body.data).toEqual([testPlayer]);
    });

    test('should return 500 if player already exists', async () => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).post('/players').send(testPlayer);

      expect(response.status).toBe(500);
      expect(response.text).toEqual('Что-то пошло не так: Error: Игрок с таким номером RDGA, PDGA или Metrix уже существует');
    });

    test('should return 400 if any of the data is corrupted', async () => {
      const response = await request(app).post('/players').send({ ...testPlayer, rdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Проверьте данные: "rdgaNumber" must be a number');
    });

    test('should return 200 and create player with null fields', async () => {
      const response = await request(app).post('/players').send(nullablePlayer);
      expect(response.status).toBe(201);
      expect(response.text).toBe('Игрок с номером РДГА 1 создан');

      const getAllResponse = await request(app).get('/players');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body.data).toEqual([nullablePlayer]);
    });
  });

  describe('PUT /players/:rdgaNumber', () => {
    beforeEach(async () => {
      await request(app).post('/players').send(testPlayer);
    });

    const playerToUpdate: Partial<typeof testPlayer> = { ...testPlayer, email: 'test1@user.com' };
    delete playerToUpdate.rdgaNumber;

    const nullablePlayerToUpdate: Partial<typeof testPlayer> = { ...nullablePlayer, name: 'Test1' };
    delete nullablePlayerToUpdate.rdgaNumber;

    test('should return 200 and update player', async () => {
      const response = await request(app).put('/players/1').send(playerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...playerToUpdate, rdgaNumber: 1 });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app).put('/players/test').send(playerToUpdate);

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

    test('should return 400 if data is corrupted', async () => {
      const response = await request(app).put('/players/1').send({ ...playerToUpdate, pdgaNumber: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Проверьте данные: "pdgaNumber" must be a number');
    });

    test('should return 200 and update player with null fields', async () => {
      const response = await request(app).put('/players/1').send(nullablePlayerToUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...nullablePlayerToUpdate, rdgaNumber: 1 });
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
      expect(response.text).toEqual('Что-то пошло не так: Error: Игрока с таким номером РДГА нет в базе');
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

      const response = await request(app).patch('/players/1/rdgaRating').send({ rating: 900 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...testPlayer, rdgaRating: 900, rdgaRatingChange: -9100 });
    });

    test('should return 400 if rdgaNumber is not a number', async () => {
      const response = await request(app).patch('/players/test/rdgaRating').send({ rating: 900 });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

    test('should return 400 if rating is not a number', async () => {
      const response = await request(app).patch('/players/1/rdgaRating').send({ rating: 'test' });

      expect(response.status).toBe(400);
      expect(response.text).toEqual('Проверьте данные: "rating" must be a number');
    });

    test('should return 200 and update player with null rating', async () => {
      const playerToCreate = { ...testPlayer };
      delete playerToCreate.rdgaRating;

      await request(app).post('/players').send({ ...playerToCreate });

      const response = await request(app).patch('/players/1/rdgaRating').send({ rating: 900 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...testPlayer, rdgaRating: 900, rdgaRatingChange: 900 });
    });
  });
});