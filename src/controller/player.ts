import playerDao from 'dao/player';

class PlayerController {
  async getAll(): Promise<Player[]> {
    const playersDao = await playerDao.getAll();

    return playersDao;
  }
}

export default new PlayerController();