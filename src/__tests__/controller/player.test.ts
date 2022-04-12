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

    test('should handle service throw with 500', async() => {
      (playerService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.getAll(request, response);

      expect(playerService.getAll).toBeCalledTimes(1);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledTimes(0);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });
  });

  describe('getByRdgaNumber', () => {
    test('should response 200 if player found', async() => {
      const request = { params: { rdgaNumber: '24' } } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockReturnValueOnce(testPlayer);

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerService.getByRdgaNumber).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith(testPlayer);
    });

    test('should response 400 if id is not a number', async() => {
      const request = { params: { id: 'some-string' } } as unknown as Request;

      await playerController.getByRdgaNumber(request, response);

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Номер РДГА должен быть числом');
      expect(playerService.getByRdgaNumber).toHaveBeenCalledTimes(0);
    });

    test('should response 404 if player wasn\'t found', async() => {
      const request = { params: { rdgaNumber: '24' } } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerService.getByRdgaNumber).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(404);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Игрок с таким номером РДГА не найден');
    });

    test('should handle service throw with 500', async() => {
      const request = { params: { rdgaNumber: '24' } } as unknown as Request;
      (playerService.getByRdgaNumber as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.getByRdgaNumber(request, response);

      expect(playerService.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerService.getByRdgaNumber).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledTimes(0);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });
  });

  describe('createPlayer', () => {
    test('should create with 200 response', async() => {
      const request = { body: { ...testPlayer } } as unknown as Request;
      (playerService.createPlayer as jest.Mock).mockReturnValueOnce(1);

      await playerController.createPlayer(request, response);

      expect(playerService.createPlayer).toBeCalledTimes(1);
      expect(playerService.createPlayer).toBeCalledWith(testPlayer);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Игрок с номером РДГА 1 создан');
    });

    test('should return 500 if something went wrong', async() => {
      const request = { body: { ...testPlayer } } as unknown as Request;
      (playerService.createPlayer as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.createPlayer(request, response);

      expect(playerService.createPlayer).toBeCalledTimes(1);
      expect(playerService.createPlayer).toBeCalledWith(testPlayer);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });

    test('should return 400 if data is corrupted', async() => {
      const request = { body: { ...testPlayer, pdgaNumber: 'test' } } as unknown as Request;

      await playerController.createPlayer(request, response);

      expect(playerService.createPlayer).toBeCalledTimes(0);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Проверьте данные: "pdgaNumber" must be a number');
    });
  });

  describe('updatePlayer', () => {
    test('should update with 200 response', async() => {
      const request = { body: { ...testPlayer }, params: { rdgaNumber: 1 } } as unknown as Request;
      delete request.body.rdgaNumber;
      (playerService.updatePlayer as jest.Mock).mockReturnValueOnce(testPlayer);

      await playerController.updatePlayer(request, response);

      expect(playerService.updatePlayer).toBeCalledTimes(1);
      expect(playerService.updatePlayer).toBeCalledWith(testPlayer);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.json).toBeCalledTimes(1);
      expect(response.json).toBeCalledWith(testPlayer);
    });

    test('should return 500 if something went wrong', async() => {
      const request = { body: { ...testPlayer }, params: { rdgaNumber: 1 } } as unknown as Request;
      delete request.body.rdgaNumber;
      (playerService.updatePlayer as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.updatePlayer(request, response);

      expect(playerService.updatePlayer).toBeCalledTimes(1);
      expect(playerService.updatePlayer).toBeCalledWith(testPlayer);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledTimes(0);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });

    test('should return 400 if data is corrupted', async() => {
      const request = { body: { ...testPlayer, pdgaNumber: 'test' }, params: { rdgaNumber: 1 } } as unknown as Request;

      await playerController.updatePlayer(request, response);

      expect(playerService.updatePlayer).toBeCalledTimes(0);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Проверьте данные: "pdgaNumber" must be a number');
    });

    test('should return 400 if rdgaNumber is not valid number', async() => {
      const request = { body: { ...testPlayer, dateOfBirth: 'test' }, params: { rdgaNumber: 'test' } } as unknown as Request;

      await playerController.updatePlayer(request, response);

      expect(playerService.updatePlayer).toBeCalledTimes(0);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Номер РДГА должен быть числом');
    });
  });

  describe('deletePlayer', () => {
    test('should response 200 if player found and deleted', async() => {
      const request = { params: { rdgaNumber: '24' } } as unknown as Request;

      await playerController.deletePlayer(request, response);

      expect(playerService.deletePlayer).toBeCalledTimes(1);
      expect(playerService.deletePlayer).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Игрок с номером РДГА 24 удален');
    });

    test('should response 400 if id is not a number', async() => {
      const request = { params: { id: 'some-string' } } as unknown as Request;

      await playerController.deletePlayer(request, response);

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Номер РДГА должен быть числом');
      expect(playerService.deletePlayer).toHaveBeenCalledTimes(0);
    });

    test('should handle service throw with 500', async() => {
      const request = { params: { rdgaNumber: '24' } } as unknown as Request;
      (playerService.deletePlayer as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.deletePlayer(request, response);

      expect(playerService.deletePlayer).toBeCalledTimes(1);
      expect(playerService.deletePlayer).toBeCalledWith(24);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.json).toBeCalledTimes(0);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: Test');
    });
  });
});
