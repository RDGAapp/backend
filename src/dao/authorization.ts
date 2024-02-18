import db from 'database';
import authorizationMapping from 'mapping/authorization';
import { IAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';

class AuthorizationDao {
  #tableName;

  constructor() {
    this.#tableName = 'auth_data';
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
    const authorization = await db(this.#tableName)
      .where({ rdga_number: data.rdga_number })
      .update(data)
      .returning('*');

    return authorization[0];
  }
}

export default new AuthorizationDao();
