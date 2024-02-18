import db from 'database';
import authorizationDao from 'dao/authorization';
import authorizationMapping from 'mapping/authorization';
import testAuthDataDb from '__tests__/mocks/authorizationDb';

jest.mock('database');

describe('Authorization Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByTelegramId', () => {
    test('should use select from table auth_data', async () => {
      await authorizationDao.getByTelegramId(1);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(authorizationMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ telegram_id: 1 });
    });
  });

  describe('getByRdgaNumber', () => {
    test('should use select from table auth_data', async () => {
      await authorizationDao.getByRdgaNumber(1);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(authorizationMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
    });
  });

  describe('create', () => {
    test('should use insert into table auth_data', async () => {
      await authorizationDao.create(testAuthDataDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().insert).toHaveBeenCalledTimes(1);
      expect(db().insert).toHaveBeenCalledWith(testAuthDataDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('update', () => {
    test('should use update table auth_data', async () => {
      await authorizationDao.update(testAuthDataDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith(testAuthDataDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });
});
