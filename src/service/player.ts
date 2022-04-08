import playerDao from 'dao/player';

class PlayerService {
  async getAll(): Promise<Player[]> {
    const playersDao = await playerDao.getAll();

    return playersDao;
  }

  async getById(id: number): Promise<Player | null> {
    const player = await playerDao.getById(id);

    return player;
  }
}

export default new PlayerService();
