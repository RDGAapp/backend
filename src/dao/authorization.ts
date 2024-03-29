import db from 'database';
import authorizationMapping from 'mapping/authorization';
import { IAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';
import { Table } from 'types/db';

class AuthorizationDao {
  #tableName;

  constructor() {
    this.#tableName = Table.AuthData;
  }

  async getByTelegramId(id: number): Promise<IAuthData | null> {
    const authorization = await db(this.#tableName)
      .select(authorizationMapping)
      .where({ telegram_id: id });

    return authorization?.[0] ?? null;
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<IAuthData | null> {
    const authorization = await db(this.#tableName)
      .select(authorizationMapping)
      .where({ rdga_number: rdgaNumber });

    return authorization?.[0] ?? null;
  }

  async create(data: IAuthDataDb): Promise<IAuthDataDb> {
    const authorization = await db(this.#tableName).insert(data).returning('*');

    return authorization[0];
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

    const authorization = await db(this.#tableName)
      .where({ rdga_number: data.rdga_number })
      .update(dataToUpdate)
      .returning('*');

    return authorization[0];
  }
}

export default new AuthorizationDao();
