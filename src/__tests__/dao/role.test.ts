import db from 'database';
import roleDao from 'dao/role';
import roleMapping from 'mapping/role';
import { Table } from 'types/db';
import testRoleDb from '__tests__/mocks/testRoleDb';

jest.mock('database');

describe('Role Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should use select from table role', async () => {
      await roleDao.getAll();
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Role);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(roleMapping);
    });
  });

  describe('create', () => {
    test('should return test role name ', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testRoleDb]);
      jest.clearAllMocks();

      const testPostName = await roleDao.create(testRoleDb);

      expect(testPostName).toBe(testRoleDb.name);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Role);
      expect(db().insert).toHaveBeenCalledTimes(1);
      expect(db().insert).toHaveBeenCalledWith(testRoleDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('name');
    });
  });

  describe('update', () => {
    test('should return updated role', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testRoleDb]);
      jest.clearAllMocks();

      const updatedPost = await roleDao.update(testRoleDb);

      expect(updatedPost).toEqual(testRoleDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Role);
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith(testRoleDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete role', async () => {
      await roleDao.delete('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Role);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ code: 'test' });
      expect(db().del).toHaveBeenCalledTimes(1);
      expect(db().del).toHaveBeenCalledWith();
    });
  });

  describe('getByCode', () => {
    test('should getByCode role', async () => {
      await roleDao.getByCode('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Role);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(roleMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ code: 'test' });
    });
  });
});
