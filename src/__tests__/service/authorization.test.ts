import authorizationService from 'service/authorization';
import authorizationDao from 'dao/authorization';

import testAuthData from '../mocks/authorization';
import { fullTelegramUser } from '../mocks/telegramUsers';
import testAuthDataDb from '../mocks/authorizationDb';

jest.mock('dao/authorization');

describe('Authorization Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByTelegramId', () => {
    test('should return authorization', async () => {
      (authorizationDao.getByTelegramId as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      const authData = await authorizationService.getByTelegramId(1);

      expect(authData).toEqual(testAuthData);
      expect(authorizationDao.getByTelegramId).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByTelegramId).toHaveBeenCalledWith(1);
    });

    test('should return null', async () => {
      (authorizationDao.getByTelegramId as jest.Mock).mockReturnValueOnce(null);

      const authData = await authorizationService.getByTelegramId(1);

      expect(authData).toEqual(null);
      expect(authorizationDao.getByTelegramId).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByTelegramId).toHaveBeenCalledWith(1);
    });
  });

  describe('updateAuthData', () => {
    test('should update authData', async () => {
      (authorizationDao.getByTelegramId as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );
      (authorizationDao.update as jest.Mock).mockReturnValueOnce(
        testAuthDataDb,
      );

      const authData = await authorizationService.updateAuthData(
        fullTelegramUser,
      );

      expect(authData).toEqual({
        rdgaNumber: 1,
        avatarUrl: 'https://some.url/photo',
      });
      expect(authorizationDao.update).toHaveBeenCalledTimes(1);
      expect(authorizationDao.update).toHaveBeenCalledWith({
        rdga_number: 1,
        telegram_auth_date: 1708176368,
        telegram_first_name: 'Test',
        telegram_id: 1,
        telegram_last_name: 'Test',
        telegram_photo_url: 'https://some.url/photo',
        telegram_username: 'Test',
      });
    });

    test('should not update authData', async () => {
      (authorizationDao.getByTelegramId as jest.Mock).mockReturnValueOnce(null);

      const authData = await authorizationService.updateAuthData(
        fullTelegramUser,
      );

      expect(authData).toEqual(null);
      expect(authorizationDao.update).toHaveBeenCalledTimes(0);
    });
  });
});
