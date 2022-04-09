import db from 'database';
import playerMapping from 'mapping/player';

class PlayerDao {
  #tableName

  constructor() {
    this.#tableName = 'player';
  }

  async getAll(): Promise<Player[]> {
    return db(this.#tableName).select(playerMapping);
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await db(this.#tableName).select(playerMapping).where({ rdga_number: rdgaNumber });

    return player?.[0] ?? null;
  }

  async createPlayer(player: PlayerDb): Promise<number> {
    const createdPlayer = await db(this.#tableName).insert(player).returning('*');
    
    return createdPlayer[0].rdga_number;
  }
}

export default new PlayerDao();
