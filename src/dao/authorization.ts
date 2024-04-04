import db from 'database';
import authorizationMapping from 'mapping/authorization';
import { IAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';
import { Table } from 'types/db';
import BaseDao from './base';

class AuthorizationDao extends BaseDao<IAuthData, IAuthDataDb, 'rdga_number'> {
  constructor() {
    super(Table.AuthData, authorizationMapping, 'rdga_number');
  }

  async getByTelegramId(id: number): Promise<IAuthData | null> {
    return this._getByKey('telegram_id', id);
  }

  async update(data: IAuthDataDb): Promise<IAuthDataDb> {
    const dataToUpdate: Record<string, string | number | null> = {
      telegram_auth_date: data.telegram_auth_date,
      telegram_username: data.telegram_username,
      telegram_first_name: data.telegram_first_name,
      telegram_last_name: data.telegram_last_name,
    };
    if (data.telegram_photo_url) {
      dataToUpdate.telegram_photo_url = data.telegram_photo_url;
    }

    const authorization = await db(this._tableName)
      .where({ rdga_number: data.rdga_number })
      .update(dataToUpdate)
      .returning('*');

    return authorization[0];
  }
}

export default new AuthorizationDao();
