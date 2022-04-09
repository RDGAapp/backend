import db from 'database';
import playerMapping from 'mapping/player';

class PlayerDao {
  async getAll(): Promise<Player[]> {
    return db.from('player').select(playerMapping);
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await db.from('player').select(playerMapping).where({ rdgaNumber });

    return player?.[0] ?? null;
  }

  async createPlayer(player: PlayerDb): Promise<number> {
    const createdPlayer = await db.insert(player).into('player').returning('*');
    
    return createdPlayer[0].rdga_number;
  }
}

export default new PlayerDao();
