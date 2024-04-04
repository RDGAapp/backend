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

  describe('update', () => {
    test('should use update table auth_data with photo_url', async () => {
      await authorizationDao.update(testAuthDataDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        telegram_first_name: 'Test',
        telegram_last_name: 'Test',
        telegram_username: 'Test',
        telegram_photo_url: 'https://some.url/photo',
        telegram_auth_date: 1708176368,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });

    test('should use update table auth_data without photo_url', async () => {
      await authorizationDao.update({
        ...testAuthDataDb,
        telegram_photo_url: null,
      });
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('auth_data');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        telegram_first_name: 'Test',
        telegram_last_name: 'Test',
        telegram_username: 'Test',
        telegram_auth_date: 1708176368,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });
});
