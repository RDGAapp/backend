import authorizationDao from 'dao/authorization';
import playersService from 'service/player';
import dbObjectToObject from 'helpers/dbObjectToObject';
import { getTelegramLoginByRdgaNumber } from 'helpers/externalApiHelpers';
import {
  checkTgAuthorization,
  mapTelegramAuthDataToDb,
} from 'helpers/telegramHelper';
import authorizationMapping from 'mapping/authorization';
import { IAuthData, ITelegramAuthData, IUserBaseInfo } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';
import BaseService from './base';

class AuthorizationService extends BaseService<
  IAuthData,
  IAuthDataDb,
  typeof authorizationDao
> {
  constructor() {
    super(authorizationDao, authorizationMapping);
  }

  async checkAuthData(
    rdgaNumber: number,
    hash: string,
  ): Promise<IUserBaseInfo> {
    const authDataFromDb = await authorizationDao.getByPrimaryKey(rdgaNumber);

    if (!authDataFromDb) throw new Error('Data is corrupted');

    if (
      !checkTgAuthorization({
        id: authDataFromDb.telegramId,
        auth_date: authDataFromDb.telegramAuthDate,
        hash,
        username: authDataFromDb.telegramUsername,
        first_name: authDataFromDb.telegramFirstName,
        last_name: authDataFromDb.telegramLastName,
        photo_url: authDataFromDb.telegramPhotoUrl,
      })
    ) {
      throw new Error('Data is corrupted');
    }

    return {
      rdgaNumber: authDataFromDb.rdgaNumber,
      avatarUrl: authDataFromDb.telegramPhotoUrl,
    };
  }

  async updateAuthData(
    telegramAuthData: ITelegramAuthData,
  ): Promise<IUserBaseInfo | null> {
    const authDataFromDb = await authorizationDao.getByTelegramId(
      telegramAuthData.id,
    );
    if (!authDataFromDb) return null;

    const authDataDb = await authorizationDao.update({
      ...mapTelegramAuthDataToDb(telegramAuthData),
      rdga_number: authDataFromDb.rdgaNumber,
    });

    const newAuthData = dbObjectToObject<IAuthDataDb, IAuthData>(
      authDataDb,
      authorizationMapping,
    );

    return {
      rdgaNumber: newAuthData.rdgaNumber,
      avatarUrl: newAuthData.telegramPhotoUrl,
    };
  }

  async createAuthData(
    rdgaNumber: number,
    telegramAuthData: ITelegramAuthData,
  ): Promise<IUserBaseInfo> {
    const authDataFromDb = await authorizationDao.getByPrimaryKey(rdgaNumber);
    if (authDataFromDb) throw new Error('Already registered');

    const playerFromDb = await playersService.checkIfPlayerExist({
      rdgaNumber,
    });
    if (!playerFromDb) throw new Error("Player doesn't exist");

    const tgLoginFromBitrix = await getTelegramLoginByRdgaNumber(rdgaNumber);
    if (
      tgLoginFromBitrix?.toLowerCase() !==
      telegramAuthData.username.toLowerCase()
    ) {
      throw new Error("This rdgaNumber doesn't belong to this telegram");
    }

    const newAuthDataDb = await authorizationDao.create({
      ...mapTelegramAuthDataToDb(telegramAuthData),
      rdga_number: rdgaNumber,
    });

    const newAuthData = dbObjectToObject<IAuthDataDb, IAuthData>(
      newAuthDataDb,
      authorizationMapping,
    );

    return {
      rdgaNumber: newAuthData.rdgaNumber,
      avatarUrl: newAuthData.telegramPhotoUrl,
    };
  }
}

export default new AuthorizationService();
