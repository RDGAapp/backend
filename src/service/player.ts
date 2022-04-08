import playerDao from 'dao/player';

class PlayerService {
  async getAll(): Promise<Player[]> {
    const playersDao = await playerDao.getAll();

    return playersDao;
  }
}

export default new PlayerService();
