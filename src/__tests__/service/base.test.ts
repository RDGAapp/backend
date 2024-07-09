import { describe, expect, test, beforeEach, jest, mock } from 'bun:test';

import testDao from '__tests__/app/dao';
import testService from '__tests__/app/service';

mock.module('__tests__/app/dao', () => ({
  default: {
    getAll: mock(),
    getAllPaginated: mock(),
    create: mock(),
    update: mock(),
    delete: mock(),
    getByPrimaryKey: mock(),
  },
}));

describe('Base Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test.only('should return whatever testDao returns', async () => {
      (testDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const roles = await testService.getAll();

      expect(roles).toEqual([]);
      expect(testDao.getAll).toHaveBeenCalledTimes(1);
      expect(testDao.getAll).toHaveBeenCalledWith();
    });

    test('should pass everything to testDao', async () => {
      (testDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const roles = await testService.getAll('one', 'two', { 3: 'three' });

      expect(roles).toEqual([]);
      expect(testDao.getAll).toHaveBeenCalledTimes(1);
      expect(testDao.getAll).toHaveBeenCalledWith('one', 'two', { 3: 'three' });
    });
  });

  describe('getAllPaginated', () => {
    test('should return whatever testDao returns', async () => {
      (testDao.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      const value = await testService.getAllPaginated(3);

      expect(value).toEqual([] as unknown as typeof value);
      expect(testDao.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(testDao.getAllPaginated).toHaveBeenCalledWith(3);
    });
  });

  describe('create', () => {
    test('should return everything', async () => {
      (testDao.create as jest.Mock).mockReturnValueOnce('Test');

      const value = await testService.create({ test: 'some' });

      expect(value).toBe('Test' as unknown as typeof value);
      expect(testDao.create).toHaveBeenCalledTimes(1);
      expect(testDao.create).toHaveBeenCalledWith({ test_db: 'some' });
    });
  });

  describe('update', () => {
    test('should return updated value', async () => {
      (testDao.update as jest.Mock).mockReturnValueOnce({
        test_db: 'from update',
      });

      const updatedValue = await testService.update({ test: 'some' });

      expect(updatedValue).toEqual({ test: 'from update' });
      expect(testDao.update).toHaveBeenCalledTimes(1);
      expect(testDao.update).toHaveBeenCalledWith({ test_db: 'some' });
    });
  });

  describe('delete', () => {
    test('should call dao delete', async () => {
      await testService.delete('test');

      expect(testDao.delete).toHaveBeenCalledTimes(1);
      expect(testDao.delete).toHaveBeenCalledWith('test');
    });
  });

  describe('getByPrimaryKey', () => {
    test('should call dao getByPrimaryKey role', async () => {
      await testService.getByPrimaryKey('test');

      expect(testDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(testDao.getByPrimaryKey).toHaveBeenCalledWith('test');
    });
  });
});
