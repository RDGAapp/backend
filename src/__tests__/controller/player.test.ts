import { Request } from 'express';
import playerController from 'controller/player';
import playerService from 'service/player';
import response from '../mocks/response';
import testPlayer from '../mocks/testPlayer';

jest.mock('service/player');

describe('Player Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (playerService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPaginated).toHaveBeenCalledWith(1, '', '', false);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should response 200 and use query values', async () => {
      (playerService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);
      const request = {
        query: {
          page: 2,
          surname: 'testSurname',
          town: 'Somewhere',
          onlyActive: 'true',
        },
      } as unknown as Request;

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPaginated).toHaveBeenCalledWith(
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
      (playerService.getAllPaginated as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('updateRdgaRating', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { rating: 900 },
        primaryKeyValue: 1,
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
        primaryKeyValue: 1,
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
        "Something's wrong: Error: Test",
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
        'Validation error: Expected number, received string at "rating"',
      );
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should activate with 200 response', async () => {
      const request = {
        primaryKeyValue: 1,
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
        primaryKeyValue: 1,
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
        "Something's wrong: Error: Test",
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
        'Validation error: Expected number, received string at "[0].rating"',
      );
    });
  });
});
