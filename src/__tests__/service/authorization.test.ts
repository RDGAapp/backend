import fetchMock from 'jest-fetch-mock';
import authorizationService from 'service/authorization';
import authorizationDao from 'dao/authorization';
import playersService from 'service/players';

import testAuthData from '../mocks/authorization';
import { fullTelegramUser } from '../mocks/telegramUsers';
import testAuthDataDb from '../mocks/authorizationDb';
import testPlayer from '../mocks/testPlayer';

jest.mock('dao/authorization');
jest.mock('service/players');
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      await expect(
        async () =>
          await authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Already registered');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test("should not create authData (player doesn't exist)", async () => {
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
      (authorizationDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
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
});
