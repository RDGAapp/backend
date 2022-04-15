import db from 'database';
import { IWithPagination } from 'knex-paginate';
import playerMapping from 'mapping/player';

class PlayerDao {
  #tableName

  constructor() {
    this.#tableName = 'player';
  }

  async getAll(pageNumber: number): Promise<IWithPagination<Player[]>> {
    return db(this.#tableName)
      .select(playerMapping)
      .orderBy('rdga_rating', 'desc')
      .paginate({
        perPage: 15,
        currentPage: pageNumber,
        isLengthAware: true,
      });
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await db(this.#tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber });

    return player?.[0] ?? null;
  }

  async getByRdgaPdgaMetrixNumber(
    rdgaNumber?: number,
    pdgaNumber?: number | null,
    metrixNumber?: number | null
  ): Promise<Player[]> {
    const player = await db(this.#tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber })
      .orWhere({ pdga_number: (pdgaNumber || 0) })
      .orWhere({ metrix_number: (metrixNumber || 0) });

    return player;
  }

  async createPlayer(player: PlayerDb): Promise<number> {
    const createdPlayer = await db(this.#tableName)
      .insert(player)
      .returning('rdga_number');
    
    return createdPlayer[0].rdga_number;
  }

  async updatePlayer(player: PlayerDb): Promise<PlayerDb> {
    const updatedPlayer = await db(this.#tableName)
      .where({ rdga_number: player.rdga_number })
      .update(player)
      .returning('*');

    return updatedPlayer[0];
  }

  async deletePlayer(rdgaNumber: number): Promise<void> {
    await db(this.#tableName)
      .where({ rdga_number: rdgaNumber })
      .del();
  }
}

export default new PlayerDao();
