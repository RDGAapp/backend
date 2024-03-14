import playerDao from 'dao/players';
import objectToDbObject from 'helpers/objectToDbObject';
import dbObjectToObject from 'helpers/dbObjectToObject';
import playerMapping from 'mapping/player';
import { IWithPagination } from 'knex-paginate';
import { IPlayer, IPlayerBase, IPlayerExtended } from 'types/player';
import { IPlayerDb } from 'types/playerDb';
import {
  getMetrixDataByNumber,
  getPdgaDataByNumber,
} from 'helpers/externalApiHelpers';
import logger from 'helpers/logger';
class PlayerService {
  async checkIfPlayerExist(
    player: Partial<IPlayerBase>,
  ): Promise<null | IPlayerBase> {
    const existingPlayer = await playerDao.getByRdgaPdgaMetrixNumber(
      player.rdgaNumber,
      player.pdgaNumber,
      player.metrixNumber,
    );

    if (existingPlayer.length === 0) return null;
    return existingPlayer[0];
  }

  async getAll(
    pageNumber: number,
    surname: string,
    town: string,
    onlyActive: boolean,
  ): Promise<IWithPagination<IPlayer[]>> {
    const playersDao = await playerDao.getAll(
      pageNumber,
      surname,
      town,
      onlyActive,
    );

    return playersDao;
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<IPlayerExtended | null> {
    const playerDb = await playerDao.getByRdgaNumber(rdgaNumber);

    if (!playerDb) return playerDb;

    let player: IPlayerExtended = {
      ...playerDb,
      metrixRating: null,
      metrixRatingChange: null,
      pdgaRating: null,
      pdgaActiveTo: null,
    };

    const externalInfo = await Promise.all([
      getMetrixDataByNumber(player.metrixNumber),
      getPdgaDataByNumber(player.pdgaNumber),
    ]);

    player = Object.assign({}, player, ...externalInfo);

    return player;
  }

  async create(player: IPlayerBase): Promise<number> {
    const exist = await this.checkIfPlayerExist(player);
    if (exist)
      throw Error('Игрок с таким номером RDGA, PDGA или Metrix уже существует');

    const playerDb = objectToDbObject<IPlayerBase, IPlayerDb>(
      player,
      playerMapping,
    );
    logger.info('Creating player: ', playerDb)

    const playerRdgaNumber = await playerDao.create(playerDb);

    return playerRdgaNumber;
  }

  async update(player: IPlayerBase): Promise<IPlayerBase> {
    const playerDb = objectToDbObject<IPlayerBase, IPlayerDb>(
      player,
      playerMapping,
    );

    const updatedIPlayerDb = await playerDao.update(playerDb);

    const updatedPlayer = dbObjectToObject<IPlayerDb, IPlayerBase>(
      updatedIPlayerDb,
      playerMapping,
    );

    return updatedPlayer;
  }

  async delete(rdgaNumber: number): Promise<void> {
    const exist = await this.checkIfPlayerExist({ rdgaNumber });
    if (!exist) throw Error('Игрока с таким номером РДГА нет в базе');

    await playerDao.delete(rdgaNumber);
  }

  async updateRdgaRating(
    rdgaNumber: number,
    rdgaRating: number,
  ): Promise<IPlayerBase> {
    const existingPlayer = await this.checkIfPlayerExist({ rdgaNumber });
    if (!existingPlayer)
      throw Error(`Игрока с номером РДГА ${rdgaNumber} нет в базе`);

    const ratingDifference = rdgaRating - (existingPlayer.rdgaRating || 0);

    const playerDb = await playerDao.updateRdgaRating(
      rdgaNumber,
      rdgaRating,
      ratingDifference,
    );

    const player = dbObjectToObject<IPlayerDb, IPlayerBase>(
      playerDb,
      playerMapping,
    );

    return player;
  }

  async activatePlayerForCurrentYear(rdgaNumber: number): Promise<IPlayerBase> {
    const existingPlayer = await this.checkIfPlayerExist({ rdgaNumber });
    if (!existingPlayer)
      throw Error(`Игрока с номером РДГА ${rdgaNumber} нет в базе`);

    const playerDb = await playerDao.activatePlayerForCurrentYear(rdgaNumber);

    const player = dbObjectToObject<IPlayerDb, IPlayerBase>(
      playerDb,
      playerMapping,
    );

    return player;
  }
}

export default new PlayerService();
