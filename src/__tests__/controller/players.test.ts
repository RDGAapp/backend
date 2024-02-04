import { Request } from 'express';
import playerController from 'controller/players';
import playerService from 'service/players';
import response from '../mocks/response';
import testPlayer from '../mocks/testPlayer';

jest.mock('service/players');

describe('Player Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (playerService.getAll as jest.Mock).mockReturnValueOnce([]);

      await playerController.getAll(request, response);

      expect(playerService.getAll).toHaveBeenCalledTimes(1);
      expect(playerService.getAll).toHaveBeenCalledWith(1, '', '', false);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should response 200 and use query values', async () => {
      (playerService.getAll as jest.Mock).mockReturnValueOnce([]);
      const request = {
        query: {
          page: 2,
          surname: 'testSurname',
          town: 'Somewhere',
          onlyActive: 'true',
        },
      } as unknown as Request;

      await playerController.getAll(request, response);

      expect(playerService.getAll).toHaveBeenCalledTimes(1);
      expect(playerService.getAll).toHaveBeenCalledWith(
        2,
        'testSurname',
        'Somewhere',
        true,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (playerService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.getAll(request, response);

      expect(playerService.getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });

  describe('getByRdgaNumber', () => {
    test('should response 200 if player found', async () => {
      const request = { rdgaNumber: 24 } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerService.getByRdgaNumber).toHaveBeenCalledWith(24);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPlayer);
    });

    test("should response 404 if player wasn't found", async () => {
      const request = { rdgaNumber: 24 } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerService.getByRdgaNumber).toHaveBeenCalledWith(24);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Игрок с таким номером РДГА не найден',
      );
    });

    test('should handle service throw with 500', async () => {
      const request = { rdgaNumber: 24 } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerService.getByRdgaNumber).toHaveBeenCalledWith(24);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });

  describe('create', () => {
    test('should create with 201 response', async () => {
      const request = { body: { ...testPlayer } } as unknown as Request;
      (playerService.create as jest.Mock).mockReturnValueOnce(1);

      await playerController.create(request, response);

      expect(playerService.create).toHaveBeenCalledTimes(1);
      expect(playerService.create).toHaveBeenCalledWith(testPlayer);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Игрок с номером РДГА 1 создан',
      );
    });

    test('should return 500 if something went wrong', async () => {
      const request = { body: { ...testPlayer } } as unknown as Request;
      (playerService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.create(request, response);

      expect(playerService.create).toHaveBeenCalledTimes(1);
      expect(playerService.create).toHaveBeenCalledWith(testPlayer);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testPlayer, pdgaNumber: 'test' },
      } as unknown as Request;

      await playerController.create(request, response);

      expect(playerService.create).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "pdgaNumber" must be a number',
      );
    });
  });

  describe('update', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { ...testPlayer },
        rdgaNumber: 1,
      } as unknown as Request;
      delete request.body.rdgaNumber;
      (playerService.update as jest.Mock).mockReturnValueOnce(testPlayer);

      await playerController.update(request, response);

      expect(playerService.update).toHaveBeenCalledTimes(1);
      expect(playerService.update).toHaveBeenCalledWith(testPlayer);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPlayer);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testPlayer },
        rdgaNumber: 1,
      } as unknown as Request;
      delete request.body.rdgaNumber;
      (playerService.update as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.update(request, response);

      expect(playerService.update).toHaveBeenCalledTimes(1);
      expect(playerService.update).toHaveBeenCalledWith(testPlayer);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testPlayer, pdgaNumber: 'test' },
        rdgaNumber: 1,
      } as unknown as Request;

      await playerController.update(request, response);

      expect(playerService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "pdgaNumber" must be a number',
      );
    });
  });

  describe('delete', () => {
    test('should response 200 if player found and deleted', async () => {
      const request = { rdgaNumber: 24 } as unknown as Request;

      await playerController.delete(request, response);

      expect(playerService.delete).toHaveBeenCalledTimes(1);
      expect(playerService.delete).toHaveBeenCalledWith(24);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Игрок с номером РДГА 24 удален',
      );
    });

    test('should handle service throw with 500', async () => {
      const request = { rdgaNumber: 24 } as unknown as Request;
      (playerService.delete as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.delete(request, response);

      expect(playerService.delete).toHaveBeenCalledTimes(1);
      expect(playerService.delete).toHaveBeenCalledWith(24);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });

  describe('updateRdgaRating', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { rating: 900 },
        rdgaNumber: 1,
      } as unknown as Request;
      (playerService.updateRdgaRating as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await playerController.updateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerService.updateRdgaRating).toHaveBeenCalledWith(1, 900);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPlayer);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { rating: 900 },
        rdgaNumber: 1,
      } as unknown as Request;
      (playerService.updateRdgaRating as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.updateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerService.updateRdgaRating).toHaveBeenCalledWith(1, 900);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { rating: 'test' },
        rdgaNumber: 1,
      } as unknown as Request;

      await playerController.updateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "rating" must be a number',
      );
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should activate with 200 response', async () => {
      const request = {
        rdgaNumber: 1,
      } as unknown as Request;
      (
        playerService.activatePlayerForCurrentYear as jest.Mock
      ).mockReturnValueOnce(testPlayer);

      await playerController.activatePlayerForCurrentYear(request, response);

      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledTimes(
        1,
      );
      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledWith(
        1,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPlayer);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        rdgaNumber: 1,
      } as unknown as Request;
      (
        playerService.activatePlayerForCurrentYear as jest.Mock
      ).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.activatePlayerForCurrentYear(request, response);

      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledTimes(
        1,
      );
      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledWith(
        1,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });

  describe('multipleUpdateRdgaRating', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: [{ rdgaNumber: 1, rating: 900 }],
      } as unknown as Request;
      (playerService.updateRdgaRating as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await playerController.multipleUpdateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerService.updateRdgaRating).toHaveBeenCalledWith(1, 900);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({
        errors: [],
        updatedPlayers: [testPlayer],
      });
    });

    test('should return 200 with errors array if something went wrong', async () => {
      const errorToThrow = new Error('Test');
      const request = {
        body: [{ rdgaNumber: 1, rating: 900 }],
      } as unknown as Request;
      (playerService.updateRdgaRating as jest.Mock).mockImplementationOnce(
        () => {
          throw errorToThrow;
        },
      );

      await playerController.multipleUpdateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerService.updateRdgaRating).toHaveBeenCalledWith(1, 900);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({
        errors: [errorToThrow],
        updatedPlayers: [],
      });
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: [{ rdgaNumber: 1, rating: 'hehe' }],
      } as unknown as Request;

      await playerController.multipleUpdateRdgaRating(request, response);

      expect(playerService.updateRdgaRating).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "[0].rating" must be a number',
      );
    });
  });
});
