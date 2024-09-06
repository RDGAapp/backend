import { mock as fetchMock, clearMocks as clearFetchMock } from 'bun-bagel';
import { describe, expect, test, jest, beforeEach } from 'bun:test';
import authorizationService from 'service/authorization';
import authorizationDao from 'dao/authorization';
import playersService from 'service/player';

import testAuthData from '../mocks/authorization';
import { fullTelegramUser } from '../mocks/telegramUsers';
import testAuthDataDb from '../mocks/authorizationDb';
import testPlayer from '../mocks/testPlayer';
import {
  mockAuthorizationDao,
  mockPlayerServices,
} from '__tests__/mocks/modules';

mockAuthorizationDao();
mockPlayerServices();

describe('Authorization Service', () => {
  beforeEach(() => {
    clearFetchMock();
    jest.clearAllMocks();
  });

  describe('updateAuthData', () => {
    test.todo('should update authData', async () => {
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

    test.todo('should not update authData', async () => {
      (authorizationDao.getByTelegramId as jest.Mock).mockReturnValueOnce(null);

      const authData = await authorizationService.updateAuthData(
        fullTelegramUser,
      );

      expect(authData).toEqual(null);
      expect(authorizationDao.update).toHaveBeenCalledTimes(0);
    });
  });

  describe('createAuthData', () => {
    test.todo('should create authData (username same case)', async () => {
      fetchMock(
        '/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=1&SELECT[]=IM',
        {
          data: {
            result: [
              {
                IM: [
                  { VALUE_TYPE: 'TELEGRAM', VALUE: fullTelegramUser.username },
                ],
              },
            ],
            total: 1,
          },
        },
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

    test.todo('should create authData (username different case)', async () => {
      fetchMock(
        '/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=1&SELECT[]=IM',
        {
          data: {
            result: [
              {
                IM: [{ VALUE_TYPE: 'TELEGRAM', VALUE: 'tEsT' }],
              },
            ],
            total: 1,
          },
        },
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

    test.todo('should not create authData (already registered)', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      expect(
        authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Already registered');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test.todo("should not create authData (player doesn't exist)", async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        null,
      );

      expect(
        authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow("Player doesn't exist");
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test.todo('should not create authData (bitrix response total 0)', async () => {
      fetchMock(
        '/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=1&SELECT[]=IM',
        {
          data: {
            result: [],
            total: 0,
          },
        },
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      expect(
        authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Bitrix error: more or less than 1 contact found');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test.todo('should not create authData (bitrix response total more than 1)', async () => {
      fetchMock(
        '/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=1&SELECT[]=IM',
        {
          data: {
            result: [],
            total: 10,
          },
        },
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      expect(
        authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow('Bitrix error: more or less than 1 contact found');
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });

    test.todo('should not create authData (bitrix response another username)', async () => {
      fetchMock(
        '/crm.contact.list.json?FILTER[UF_CRM_CONTACT_1705326811592]=1&SELECT[]=IM',
        {
          data: {
            result: [
              {
                IM: [{ VALUE_TYPE: 'TELEGRAM', VALUE: 'some_random_one' }],
              },
            ],
            total: 1,
          },
        },
      );
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      (playersService.checkIfPlayerExist as jest.Mock).mockReturnValueOnce(
        testPlayer,
      );

      expect(
        authorizationService.createAuthData(1, fullTelegramUser),
      ).rejects.toThrow("This rdgaNumber doesn't belong to this telegram");
      expect(authorizationDao.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('checkAuthData', () => {
    const correctHash =
      '8f6db6edb9965f49a0d3ff6dd62433afb90ff3f2081397035e3b03f84069d939';

    test.todo('should return baseUserInfo', async () => {
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

    test.todo('should throw with wrong hash', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(
        testAuthData,
      );

      expect(authorizationService.checkAuthData(1, 'hash')).rejects.toThrow(
        'Data is corrupted',
      );
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test.todo('should throw if no user', async () => {
      (authorizationDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);

      expect(
        authorizationService.checkAuthData(1, correctHash),
      ).rejects.toThrow('Data is corrupted');
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(authorizationDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });
  });
});
