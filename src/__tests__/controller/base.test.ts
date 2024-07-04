import { describe, expect, test, mock, afterEach, jest } from 'bun:test';
import response from '../mocks/response';
import testService from '__tests__/app/service';
import testController, {
  controllerWoDisplayKey,
} from '__tests__/app/controller';
import { RdgaRequest } from 'controller/base';
import { ITestDb } from '__tests__/app/helpers';

mock.module('__tests__/app/service', () => ({
  default: {
    getAll: mock(),
    getAllPaginated: mock(),
    create: mock(),
    update: mock(),
    delete: mock(),
    getByPrimaryKey: mock(),
  },
}));

type TestRequest = RdgaRequest<ITestDb, 'test_db'>;

const testValue = { test: 'some' };
const updatedTestValue = { test_db: 'more', display_db: 'one' };

describe('Base Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as TestRequest;

    test('should response 200', async () => {
      (testService.getAll as jest.Mock).mockReturnValueOnce([]);

      await testController.getAll(request, response);

      expect(testService.getAll).toHaveBeenCalledTimes(1);
      expect(testService.getAll).toHaveBeenCalledWith();
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (testService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.getAll(request, response);

      expect(testService.getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('getAllPaginated', () => {
    const request = { query: {} } as TestRequest;

    test('should response 200', async () => {
      (testService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      await testController.getAllPaginated(request, response);

      expect(testService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(testService.getAllPaginated).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (testService.getAllPaginated as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.getAllPaginated(request, response);

      expect(testService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('create', () => {
    test('should create with 201 response', async () => {
      const request = {
        body: { ...testValue },
      } as TestRequest;
      (testService.create as jest.Mock).mockReturnValueOnce({ display_db: 1 });

      await testController.create(request, response);

      expect(testService.create).toHaveBeenCalledTimes(1);
      expect(testService.create).toHaveBeenCalledWith({
        ...testValue,
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Value "1" created');
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testValue },
      } as TestRequest;
      (testService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.create(request, response);

      expect(testService.create).toHaveBeenCalledTimes(1);
      expect(testService.create).toHaveBeenCalledWith({
        ...testValue,
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testValue, test: 1 },
      } as TestRequest;

      await testController.create(request, response);

      expect(testService.create).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Validation error: Expected string, received number at "test"',
      );
    });

    test('should return primaryKey value', async () => {
      const request = {
        body: { ...testValue },
      } as TestRequest;
      (testService.create as jest.Mock).mockReturnValueOnce({ test_db: 1 });

      await controllerWoDisplayKey.create(request, response);

      expect(testService.create).toHaveBeenCalledTimes(1);
      expect(testService.create).toHaveBeenCalledWith({
        ...testValue,
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Value "1" created');
    });
  });

  describe('update', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { ...testValue },
        primaryKeyValue: 'test',
      } as TestRequest;

      (testService.update as jest.Mock).mockReturnValueOnce({
        ...updatedTestValue,
      });

      await testController.update(request, response);

      expect(testService.update).toHaveBeenCalledTimes(1);
      expect(testService.update).toHaveBeenCalledWith({
        test: 'test',
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(updatedTestValue);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { test: 'some' },
        primaryKeyValue: 'test',
      } as TestRequest;
      delete request.body.rdgaNumber;
      (testService.update as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.update(request, response);

      expect(testService.update).toHaveBeenCalledTimes(1);
      expect(testService.update).toHaveBeenCalledWith({
        test: 'test',
      });
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
        body: { ...testValue, some: 'one' },
        primaryKeyValue: 'test',
      } as TestRequest;

      await testController.update(request, response);

      expect(testService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Validation error: Unrecognized key(s) in object: 'some'",
      );
    });

    test('should return 400 if tournamentCode empty', async () => {
      const request = {
        body: { ...testValue },
        primaryKeyValue: '',
      } as TestRequest;

      await testController.update(request, response);

      expect(testService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('delete', () => {
    test('should response 200 if post found and deleted', async () => {
      const request = { primaryKeyValue: 'test' } as TestRequest;

      await testController.delete(request, response);

      expect(testService.delete).toHaveBeenCalledTimes(1);
      expect(testService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Value "test" deleted');
    });

    test('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 'test' } as TestRequest;
      (testService.delete as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.delete(request, response);

      expect(testService.delete).toHaveBeenCalledTimes(1);
      expect(testService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if tournamentCode empty', async () => {
      const request = { primaryKeyValue: '' } as TestRequest;

      await testController.delete(request, response);

      expect(testService.delete).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('getByPrimaryKey', () => {
    test('should response 200 if post found', async () => {
      (testService.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        code: 'test',
      });
      const request = { primaryKeyValue: 'test' } as TestRequest;

      await testController.getByPrimaryKey(request, response);

      expect(testService.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(testService.getByPrimaryKey).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ code: 'test' });
    });

    test('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 'test' } as TestRequest;
      (testService.getByPrimaryKey as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await testController.getByPrimaryKey(request, response);

      expect(testService.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(testService.getByPrimaryKey).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if tournamentCode empty', async () => {
      const request = { primaryKeyValue: '' } as TestRequest;

      await testController.getByPrimaryKey(request, response);

      expect(testService.getByPrimaryKey).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key value provided",
      );
    });

    test('should response 404 if post not found', async () => {
      (testService.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      const request = { primaryKeyValue: 'test' } as TestRequest;

      await testController.getByPrimaryKey(request, response);

      expect(testService.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(testService.getByPrimaryKey).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Not found');
    });
  });
});
