import { Request } from 'express';
import tournamentsController from 'controller/tournament';
import tournamentsService from 'service/tournament';
import response from '../mocks/response';

jest.mock('service/tournament');

describe('Tournament Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (tournamentsService.getAll as jest.Mock).mockReturnValueOnce([]);

      await tournamentsController.getAll(request, response);

      expect(tournamentsService.getAll).toHaveBeenCalledTimes(1);
      expect(tournamentsService.getAll).toHaveBeenCalledWith('', '');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (tournamentsService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await expect(
        async () => await tournamentsController.getAll(request, response),
      ).rejects.toThrow('Test');
      expect(tournamentsService.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
