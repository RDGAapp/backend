import authorizationDao from 'dao/authorization';
import dbObjectToObject from 'helpers/dbObjectToObject';
import { mapTelegramAuthDataToDb } from 'helpers/telegramHelper';
import authorizationMapping from 'mapping/authorization';
import { IAuthData, ITelegramAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';

class AuthorizationService {
  async getByTelegramId(telegramId: number): Promise<IAuthData | null> {
    return authorizationDao.getByTelegramId(telegramId);
  }

  async updateAuthData(
    telegramAuthData: ITelegramAuthData,
  ): Promise<{ rdgaNumber: number; avatarUrl: string | null } | null> {
    const authDataFromDb = await this.getByTelegramId(telegramAuthData.id);
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
}

export default new AuthorizationService();
