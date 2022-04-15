import playerDao from 'dao/player';
import objectToDbObject from 'helpers/objectToDbObject';
import dbObjectToObject from 'helpers/dbObjectToObject';
import playerMapping from 'mapping/player';
import { IWithPagination } from 'knex-paginate';
class PlayerService {
  async checkIfPlayerExist(player: Partial<Player>): Promise<boolean> {
    const existingPlayer = await playerDao
      .getByRdgaPdgaMetrixNumber(player.rdgaNumber, player.pdgaNumber, player.metrixNumber);

    if(existingPlayer.length === 0) return false;
    return true;
  }

  async getAll(pageNumber: number): Promise<IWithPagination<Player[]>> {
    const playersDao = await playerDao.getAll(pageNumber);

    return playersDao;
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await playerDao.getByRdgaNumber(rdgaNumber);

    return player;
  }

  async createPlayer(player: Player): Promise<number> {
    const exist = await this.checkIfPlayerExist(player);
    if (exist) throw Error('Игрок с таким номером RDGA, PDGA или Metrix уже существует');

    const playerDb = objectToDbObject<Player, PlayerDb>(player, playerMapping);

    const playerRdgaNumber = await playerDao.createPlayer(playerDb);

    return playerRdgaNumber;
  }

  async updatePlayer(player: Player): Promise<Player> {
    const playerDb = objectToDbObject<Player, PlayerDb>(player, playerMapping);

    const updatedPlayerDb = await playerDao.updatePlayer(playerDb);

    const updatedPlayer = dbObjectToObject<PlayerDb, Player>(updatedPlayerDb, playerMapping);
    return updatedPlayer;
  }

  async deletePlayer(rdgaNumber: number): Promise<void> {
    const exist = await this.checkIfPlayerExist({ rdgaNumber });
    if (!exist) throw Error('Игрока с таким номером РДГА нет в базе');

    await playerDao.deletePlayer(rdgaNumber);
  }
}

export default new PlayerService();
