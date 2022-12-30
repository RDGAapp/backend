import { Request } from 'express';
import tournamentsController from 'controller/tournaments';
import tournamentsService from 'service/tournaments';
import response from '../mocks/response';
import testTournament from '__tests__/mocks/testTournament';

jest.mock('service/tournaments');

describe('Tournaments Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (tournamentsService.getAll as jest.Mock).mockReturnValueOnce([]);

      await tournamentsController.getAll(request, response);

      expect(tournamentsService.getAll).toBeCalledTimes(1);
      expect(tournamentsService.getAll).toBeCalledWith();
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (tournamentsService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.getAll(request, response);

      expect(tournamentsService.getAll).toBeCalledTimes(1);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledTimes(0);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });
  });

  describe('create', () => {
    test('should create with 201 response', async () => {
      const request = { body: { ...testTournament } } as unknown as Request;
      (tournamentsService.create as jest.Mock).mockReturnValueOnce(1);

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toBeCalledTimes(1);
      expect(tournamentsService.create).toBeCalledWith(testTournament);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(201);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Турнир 1 создан');
    });

    test('should return 500 if something went wrong', async () => {
      const request = { body: { ...testTournament } } as unknown as Request;
      (tournamentsService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toBeCalledTimes(1);
      expect(tournamentsService.create).toBeCalledWith(testTournament);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testTournament, name: 1 },
      } as unknown as Request;

      await tournamentsController.create(request, response);

      expect(tournamentsService.create).toBeCalledTimes(0);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith(
        'Проверьте данные: "name" must be a string',
      );
    });
  });
});
