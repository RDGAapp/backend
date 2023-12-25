import { Request } from 'express';
import postsController from 'controller/posts';
import postsService from 'service/posts';
import response from '../mocks/response';
import testPost from '__tests__/mocks/testPost';

jest.mock('service/posts');

describe('Posts Controller', () => {
  const testPostWithoutDate = {
    code: testPost.code,
    header: testPost.header,
    text: testPost.text,
    author: testPost.author,
  };

  const testPostWithoutCode = {
    header: testPost.header,
    text: testPost.text,
    author: testPost.author,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-02'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200', async () => {
      (postsService.getAll as jest.Mock).mockReturnValueOnce([]);

      await postsController.getAll(request, response);

      expect(postsService.getAll).toHaveBeenCalledTimes(1);
      expect(postsService.getAll).toHaveBeenCalledWith({ pageNumber: 1 });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (postsService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.getAll(request, response);

      expect(postsService.getAll).toHaveBeenCalledTimes(1);
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
      const request = {
        body: { ...testPostWithoutDate },
      } as unknown as Request;
      (postsService.create as jest.Mock).mockReturnValueOnce(1);

      await postsController.create(request, response);

      expect(postsService.create).toHaveBeenCalledTimes(1);
      expect(postsService.create).toHaveBeenCalledWith({
        ...testPostWithoutDate,
        createdAt: new Date().toISOString(),
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Пост "1" создан');
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testPostWithoutDate },
      } as unknown as Request;
      (postsService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.create(request, response);

      expect(postsService.create).toHaveBeenCalledTimes(1);
      expect(postsService.create).toHaveBeenCalledWith({
        ...testPostWithoutDate,
        createdAt: new Date().toISOString(),
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testPostWithoutDate, header: 1 },
      } as unknown as Request;

      await postsController.create(request, response);

      expect(postsService.create).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "header" must be a string',
      );
    });
  });

  describe('update', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { ...testPostWithoutCode },
        postCode: 'test',
      } as unknown as Request;

      (postsService.update as jest.Mock).mockReturnValueOnce(testPost);

      await postsController.update(request, response);

      expect(postsService.update).toHaveBeenCalledTimes(1);
      expect(postsService.update).toHaveBeenCalledWith({
        ...testPostWithoutCode,
        code: 'test',
        createdAt: new Date().toISOString(),
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPost);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testPostWithoutCode },
        postCode: 'test',
      } as unknown as Request;
      delete request.body.rdgaNumber;
      (postsService.update as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.update(request, response);

      expect(postsService.update).toHaveBeenCalledTimes(1);
      expect(postsService.update).toHaveBeenCalledWith({
        ...testPostWithoutCode,
        code: 'test',
        createdAt: new Date().toISOString(),
      });
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
        body: { ...testPost },
        postCode: 'test',
      } as unknown as Request;

      await postsController.update(request, response);

      expect(postsService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Проверьте данные: "code" is not allowed',
      );
    });
  });

  describe('delete', () => {
    test('should response 200 if post found and deleted', async () => {
      const request = { postCode: 'test' } as unknown as Request;

      await postsController.delete(request, response);

      expect(postsService.delete).toHaveBeenCalledTimes(1);
      expect(postsService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Пост test удален');
    });

    test('should handle service throw with 500', async () => {
      const request = { postCode: 'test' } as unknown as Request;
      (postsService.delete as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.delete(request, response);

      expect(postsService.delete).toHaveBeenCalledTimes(1);
      expect(postsService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });

  describe('getByCode', () => {
    test('should response 200 if post found', async () => {
      (postsService.getByCode as jest.Mock).mockReturnValueOnce({
        code: 'test',
      });
      const request = { postCode: 'test' } as unknown as Request;

      await postsController.getByCode(request, response);

      expect(postsService.getByCode).toHaveBeenCalledTimes(1);
      expect(postsService.getByCode).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ code: 'test' });
    });

    test('should handle service throw with 500', async () => {
      const request = { postCode: 'test' } as unknown as Request;
      (postsService.getByCode as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await postsController.getByCode(request, response);

      expect(postsService.getByCode).toHaveBeenCalledTimes(1);
      expect(postsService.getByCode).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });
});
