import authorizationDao from 'dao/authorization';
import playersService from 'service/players';
import dbObjectToObject from 'helpers/dbObjectToObject';
import { getTelegramLoginByRdgaNumber } from 'helpers/externalApiHelpers';
import { mapTelegramAuthDataToDb } from 'helpers/telegramHelper';
import authorizationMapping from 'mapping/authorization';
import { IAuthData, ITelegramAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';

class AuthorizationService {
  async updateAuthData(
    telegramAuthData: ITelegramAuthData,
  ): Promise<{ rdgaNumber: number; avatarUrl: string | null } | null> {
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
  ): Promise<{ rdgaNumber: number; avatarUrl: string | null }> {
    const authDataFromDb = await authorizationDao.getByRdgaNumber(rdgaNumber);
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
