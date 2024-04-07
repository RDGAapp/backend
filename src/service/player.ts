import playerDao from 'dao/player';
import dbObjectToObject from 'helpers/dbObjectToObject';
import playerMapping from 'mapping/player';
import { IPlayerBase, IPlayerExtended } from 'types/player';
import { IPlayerDb } from 'types/playerDb';
import {
  getMetrixDataByNumber,
  getPdgaDataByNumber,
} from 'helpers/externalApiHelpers';
import BaseService from './base';

class PlayerService extends BaseService<
  IPlayerBase,
  IPlayerDb,
  typeof playerDao
> {
  constructor() {
    super(playerDao, playerMapping);
  }

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

  async getByPrimaryKey(rdgaNumber: number): Promise<IPlayerExtended> {
    const playerDb = await playerDao.getByPrimaryKey(rdgaNumber);

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
