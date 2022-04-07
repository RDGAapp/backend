import db from 'database';
import playerMapping from 'mapping/player';

class PlayerDao {
  async getAll(): Promise<Player[]> {
    return db.from('player').select(playerMapping);
  }
}

export default new PlayerDao();
