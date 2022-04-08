import db from 'database';
import playerMapping from 'mapping/player';

class PlayerDao {
  async getAll(): Promise<Player[]> {
    return db.from('player').select(playerMapping);
  }

  async getById(id: number): Promise<Player | null> {
    const player = await db.from('player').select(playerMapping).where({ id });

    return player?.[0] ?? null;
  }
}

export default new PlayerDao();
