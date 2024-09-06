import {
  describe,
  expect,
  test,
  afterEach,
  jest,
  beforeAll,
  afterAll,
  setSystemTime,
} from 'bun:test';
import { Request } from 'express';
import postsController from 'controller/post';
import postsService from 'service/post';
import response from '../mocks/response';
import { mockPostServices } from '__tests__/mocks/modules';

mockPostServices();

describe('Post Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    setSystemTime(new Date('2020-01-02'));
  });

  afterAll(() => {
    setSystemTime();
  });

  describe('getAllPaginated', () => {
    const request = { query: {} } as Request;

    test('should response 200', async () => {
      (postsService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      await postsController.getAllPaginated(request, response);

      expect(postsService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(postsService.getAllPaginated).toHaveBeenCalledWith(1, undefined);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should pass town', async () => {
      (postsService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      await postsController.getAllPaginated(
        {
          ...request,
          query: { from: new Date().toISOString() },
        } as unknown as Request,
        response,
      );

      expect(postsService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(postsService.getAllPaginated).toHaveBeenCalledWith(
        1,
        '2020-01-02T00:00:00.000Z',
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (postsService.getAllPaginated as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.getAllPaginated(request, response);

      expect(postsService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });
});
