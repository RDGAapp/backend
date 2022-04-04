import db from 'database';

class PlayerDao {
  async getAll(): Promise<Array<PlayerDb>> {
    return db.select('*').from('player');
  }
}

export default new PlayerDao();
