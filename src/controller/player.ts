import playerDao from 'dao/player';
import playerMapping from 'mapping/player';
import mapObject from 'mapObject';

class PlayerController {
  async getAll(): Promise<Array<Player>> {
    const playersDao = await playerDao.getAll();

    return playersDao.map(playerDao => mapObject<PlayerDb, Player>(playerDao, playerMapping));
  }
}

export default new PlayerController();