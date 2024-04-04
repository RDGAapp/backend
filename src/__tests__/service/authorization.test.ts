import fetchMock from 'jest-fetch-mock';
import authorizationService from 'service/authorization';
import authorizationDao from 'dao/authorization';
import playersService from 'service/player';

import testAuthData from '../mocks/authorization';
import { fullTelegramUser } from '../mocks/telegramUsers';
import testAuthDataDb from '../mocks/authorizationDb';
import testPlayer from '../mocks/testPlayer';

jest.mock('dao/authorization');
jest.mock('service/player');
fetchMock.enableMocks();

describe('Authorization Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
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

  describe('createAuthData', () => {
    test('should create authData (username same case)', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [
                { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
              ],
            },
          ],
          total: 1,
        }),
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );
      (authorizationDao.create as jest.Mock).mockReturnValueOnce(
        testAuthDataDb,
      );

      const authData = await authorizationService.createAuthData(
        1,
        fullTelegramUser,
      );

      expect(authData).toEqual({
        rdgaNumber: 1,
        avatarUrl: testAuthDataDb.telegram_photo_url,
      });
      expect(authorizationDao.create).toHaveBeenCalledTimes(1);
      expect(authorizationDao.create).toHaveBeenCalledWith({
        rdga_number: 1,
        telegram_auth_date: 1708176368,
        telegram_first_name: 'Test',
        telegram_id: 1,
        telegram_last_name: 'Test',
        telegram_photo_url: 'https://some.url/photo',
        telegram_username: 'Test',
      });
    });

    test('should create authData (username different case)', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [{ VALUE_TYPE: 'TELEGRAM', VALUE: 'tEsT' }],
            },
          ],
          total: 1,
        }),
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );
      (authorizationDao.create as jest.Mock).mockReturnValueOnce(
        testAuthDataDb,
      );

      const authData = await authorizationService.createAuthData(
        1,
        fullTelegramUser,
      );

      expect(authData).toEqual({
        rdgaNumber: 1,
        avatarUrl: testAuthDataDb.telegram_photo_url,
      });
      expect(authorizationDao.create).toHaveBeenCalledTimes(1);
      expect(authorizationDao.create).toHaveBeenCalledWith({
        rdga_number: 1,
        telegram_auth_date: 1708176368,
        telegram_first_name: 'Test',
        telegram_id: 1,
        telegram_last_name: 'Test',
        telegram_photo_url: 'https://some.url/photo',
        telegram_username: 'Test',
      });
    });

    test('should not create authData (already registered)', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Already registered');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test("should not create authData (player doesn't exist)", async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        null,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow("Player doesn't exist");
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test('should not create authData (bitrix response total 0)', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [],
          total: 0,
        }),
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Bitrix error: more or less than 1 contact found');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test('should not create authData (bitrix response total more than 1)', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [],
          total: 10,
        }),
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Bitrix error: more or less than 1 contact found');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test('should not create authData (bitrix response another username)', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          result: [
            {
              IM: [{ VALUE_TYPE: 'TELEGRAM', VALUE: 'some_random_one' }],
            },
          ],
          total: 1,
        }),
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow("This rdgaNumber doesn't belong to this telegram");
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkAuthData', () => {
    const correctHash =
      '8f6db6edb9965f49a0d3ff6dd62433afb90ff3f2081397035e3b03f84069d939';

    test('should return baseUserInfo', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      const authData = await authorizationService.checkAuthData(1, correctHash);

      expect(authData).toEqual({
        rdgaNumber: 1,
        avatarUrl: 'https://some.url/photo',
      });
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test('should throw with wrong hash', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      await expect(
        async () => await authorizationService.checkAuthData(1, 'hash'),
      ).rejects.toThrow('Data is corrupted');
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test('should throw if no user', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);

      await expect(
        async () => await authorizationService.checkAuthData(1, correctHash),
      ).rejects.toThrow('Data is corrupted');
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });
  });
});
