import { Request, Response } from 'express';
import playerController from 'controller/player';
import playerService from 'service/player';

describe('Player Controller', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    const jsonFunctionMock = jest.fn();
    const request = {} as Request;
    const response = ({
      status: jest.fn(() => ({ json: jsonFunctionMock })),
    }) as unknown as Response;

    const getAllMock = jest.fn();
    playerService.getAll = getAllMock;
    test('should response 200 with controller result ', async() => {
      getAllMock.mockReturnValueOnce([]);
      await playerController.getAll(request, response);
      expect(getAllMock).toBeCalledTimes(1);
      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(200);
      expect(jsonFunctionMock).toBeCalledTimes(1);
      expect(jsonFunctionMock).toBeCalledWith([]);
    });
  });
});
