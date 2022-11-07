import playerDao from 'dao/player';
import objectToDbObject from 'helpers/objectToDbObject';
import dbObjectToObject from 'helpers/dbObjectToObject';
import playerMapping from 'mapping/player';
import { IWithPagination } from 'knex-paginate';
class PlayerService {
  async checkIfPlayerExist(player: Partial<Player>): Promise<null | Player> {
    const existingPlayer = await playerDao
      .getByRdgaPdgaMetrixNumber(player.rdgaNumber, player.pdgaNumber, player.metrixNumber);

    if (existingPlayer.length === 0) return null;
    return existingPlayer[0];
  }

  async getAll(pageNumber: number, surname: string, town: string): Promise<IWithPagination<Player[]>> {
    const playersDao = await playerDao.getAll(pageNumber, surname, town);

    return playersDao;
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await playerDao.getByRdgaNumber(rdgaNumber);

    return player;
  }

  async create(player: Player): Promise<number> {
    const exist = await this.checkIfPlayerExist(player);
    if (exist) throw Error('Игрок с таким номером RDGA, PDGA или Metrix уже существует');

    const playerDb = objectToDbObject<Player, PlayerDb>(player, playerMapping);

    const playerRdgaNumber = await playerDao.create(playerDb);

    return playerRdgaNumber;
  }

  async update(player: Player): Promise<Player> {
    const playerDb = objectToDbObject<Player, PlayerDb>(player, playerMapping);

    const updatedPlayerDb = await playerDao.update(playerDb);

    const updatedPlayer = dbObjectToObject<PlayerDb, Player>(updatedPlayerDb, playerMapping);
    return updatedPlayer;
  }

  async delete(rdgaNumber: number): Promise<void> {
    const exist = await this.checkIfPlayerExist({ rdgaNumber });
    if (!exist) throw Error('Игрока с таким номером РДГА нет в базе');

    await playerDao.delete(rdgaNumber);
  }

  async updateRdgaRating(rdgaNumber: number, rdgaRating: number): Promise<Player> {
    const existingPlayer = await this.checkIfPlayerExist({ rdgaNumber });
    if (!existingPlayer) throw Error(`Игрока с номером РДГА ${rdgaNumber} нет в базе`);

    const ratingDifference = rdgaRating - (existingPlayer.rdgaRating || 0);

    const playerDb = await playerDao.updateRdgaRating(rdgaNumber, rdgaRating, ratingDifference);

    const player = dbObjectToObject<PlayerDb, Player>(playerDb, playerMapping);

    return player;
  }
}

export default new PlayerService();
