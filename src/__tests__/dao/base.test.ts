import { describe, expect, test, afterEach, jest } from 'bun:test';

import db from 'database';
import testDao from '__tests__/app/dao';
import { tableName, testMapping } from '__tests__/app/helpers';
import { mockDatabase } from '__tests__/mocks/modules';

mockDatabase();

const testSome = { test_db: 'some', display_db: 'more' };

describe('Base Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should use select from table role', async () => {
      await testDao.getAll();
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('test');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({ test: 'test_db' });
    });
  });

  describe('getAllPaginated', () => {
    test('should use select from table post', async () => {
      await testDao.getAllPaginated(1, 'some', 'test', 123);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('test');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(testMapping);
      expect(db().paginate).toHaveBeenCalledTimes(1);
      expect(db().paginate).toHaveBeenCalledWith({
        perPage: 30,
        currentPage: 1,
        isLengthAware: true,
      });
    });
  });

  describe('create', () => {
    test('should return test role name ', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testSome]);
      jest.clearAllMocks();

      const createdValue = await testDao.create(testSome);

      expect(createdValue.test_db).toBe(testSome.test_db);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(tableName);
      expect(db().insert).toHaveBeenCalledTimes(1);
      expect(db().insert).toHaveBeenCalledWith(testSome);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('update', () => {
    test('should return updated role', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testSome]);
      jest.clearAllMocks();

      const updatedValue = await testDao.update(testSome);

      expect(updatedValue).toEqual(testSome);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(tableName);
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith(testSome);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete role', async () => {
      await testDao.delete('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(tableName);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ test_db: 'test' });
      expect(db().del).toHaveBeenCalledTimes(1);
      expect(db().del).toHaveBeenCalledWith();
    });
  });

  describe('getByPrimaryKey', () => {
    test('should getByPrimaryKey role', async () => {
      await testDao.getByPrimaryKey('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(tableName);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(testMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ test_db: 'test' });
    });
  });
});
