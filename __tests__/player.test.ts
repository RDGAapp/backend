import request from 'supertest';
import app from '../src/app';
import db from '../src/database';
import testPlayer from '../src/__tests__/mocks/testPlayer';

describe('Player endpoints', () => {
  beforeEach(async() => {
    await db.migrate.latest();
  });

  afterEach(async() => {
    await db.migrate.rollback();
  });

  describe('GET /players', () => {
    test('should return 200 with empty array', async() => {
      const response = await request(app).get('/players');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return 200 with someData', async() => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([testPlayer]);
    });
  });

  describe('GET /players/:rdgaNumber', () => {
    test('should return 200 with player', async() => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).get('/players/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testPlayer);
    });

    test('should return 404 if player does not exist', async() => {
      const response = await request(app).get('/players/1');
      
      expect(response.status).toBe(404);
      expect(response.text).toEqual('Игрок с таким номером РДГА не найден');
    });

    test('should return 400 if rdgaNumber is not a number', async() => {
      const response = await request(app).get('/players/test');
      
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

  });

  describe('POST /players', () => {
    test('should return 200 and create player', async() => {
      const response = await request(app).post('/players').send(testPlayer);
      expect(response.status).toBe(200);
      expect(response.text).toBe('Игрок с номером РДГА 1 создан');
      
      const getAllResponse = await request(app).get('/players');
      expect(getAllResponse.status).toBe(200);
      expect(getAllResponse.body).toEqual([testPlayer]);
    });

    test('should return 500 if player already exists', async() => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).post('/players').send(testPlayer);
      
      expect(response.status).toBe(500);
      expect(response.text).toEqual('Что-то пошло не так: Error: Игрок с таким номером RDGA, PDGA или Metrix уже существует');
    });

    test('should return 400 if any of the data is corrupted', async() => {
      const response = await request(app).post('/players').send({ ...testPlayer, rdgaNumber: 'test' });
      
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Проверьте данные: "rdgaNumber" must be a number');
    });
  });

  describe('PUT /players/:rdgaNumber', () => {
    beforeEach(async() => {
      await request(app).post('/players').send(testPlayer);
    });

    const playerToUpdate: Partial<typeof testPlayer> = { ...testPlayer, email: 'test1@user.com' };
    delete playerToUpdate.rdgaNumber;

    test('should return 200 and update player', async() => {
      const response = await request(app).put('/players/1').send(playerToUpdate);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...playerToUpdate, rdgaNumber: 1 });
    });

    test('should return 400 if rdgaNumber is not a number', async() => {
      const response = await request(app).put('/players/test').send(playerToUpdate);
      
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

    test('should return 400 if data is corrupted', async() => {
      const response = await request(app).put('/players/1').send({ ...playerToUpdate, pdgaNumber: 'test' });
      
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Проверьте данные: "pdgaNumber" must be a number');
    });
  });

  describe('DELETE /players/:rdgaNumber', () => {
    test('should return 200 and delete player', async() => {
      await request(app).post('/players').send(testPlayer);
      const response = await request(app).del('/players/1');
      
      expect(response.status).toBe(200);
      expect(response.text).toEqual('Игрок с номером РДГА 1 удален');

      const getResponse = await request(app).get('/players/1');
      expect(getResponse.status).toBe(404);
    });

    test('should return 500 if player does not exist', async() => {
      const response = await request(app).del('/players/1');
      
      expect(response.status).toBe(500);
      expect(response.text).toEqual('Что-то пошло не так: Error: Игрока с таким номером РДГА нет в базе');
    });

    test('should return 400 if rdgaNumber is not a number', async() => {
      const response = await request(app).del('/players/test');
      
      expect(response.status).toBe(400);
      expect(response.text).toEqual('Номер РДГА должен быть числом');
    });

  });
});