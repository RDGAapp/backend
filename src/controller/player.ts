import playerDao from 'dao/player';
import playerMapping from 'mapping/player';
import mapObject from 'mapObject';

class PlayerController {
  async getAll() {
    const playersDao = await playerDao.getAll();

    return playersDao.map(playerDao => mapObject(playerDao, playerMapping));
  }
}

export default new PlayerController();