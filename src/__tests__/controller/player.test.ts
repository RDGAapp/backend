import { Request } from 'express';
import playerController from 'controller/player';
import playerService from 'service/player';
import response from '../helpers/response';
import mockPlayer from '../helpers/mockPlayer';

jest.mock('service/player');

describe('Player Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = {} as Request;

    test('should response 200 with controller result ', async() => {
      (playerService.getAll as jest.Mock).mockReturnValueOnce([]);
      await playerController.getAll(request, response);
      expect(playerService.getAll).toBeCalledTimes(1);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith([]);
    });
  });

  describe('getById', () => {
    test('should response 200 if player found', async() => {
      const request = { params: { id: '24' } } as unknown as Request;
      (playerService.getById as jest.Mock).mockReturnValueOnce(mockPlayer);

      await playerController.getById(request, response);

      expect(playerService.getById).toBeCalledTimes(1);
      expect(playerService.getById).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith(mockPlayer);
    });

    test('should response 400 if id is not a number', async() => {
      const request = { params: { id: 'some-string' } } as unknown as Request;

      await playerController.getById(request, response);

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('ID должен быть числом');
      expect(playerService.getById).toHaveBeenCalledTimes(0);
    });

    test('should response 404 if player wasn\'t found', async() => {
      const request = { params: { id: '24' } } as unknown as Request;
      (playerService.getById as jest.Mock).mockReturnValueOnce(null);

      await playerController.getById(request, response);

      expect(playerService.getById).toBeCalledTimes(1);
      expect(playerService.getById).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(404);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Игрок с таким ID не найден');
    });
  });
});
