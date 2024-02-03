import playerDao from 'dao/players';
import objectToDbObject from 'helpers/objectToDbObject';
import dbObjectToObject from 'helpers/dbObjectToObject';
import playerMapping from 'mapping/player';
import { IWithPagination } from 'knex-paginate';
import { IPlayer, IPlayerExtended } from 'types/player';
import { IPlayerDb } from 'types/playerDb';
class PlayerService {
  async checkIfPlayerExist(player: Partial<IPlayer>): Promise<null | IPlayer> {
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

  async getByRdgaNumber(rdgaNumber: number): Promise<IPlayer | null> {
    const playerDb = await playerDao.getByRdgaNumber(rdgaNumber);

    const player: IPlayerExtended | null = playerDb
      ? { ...playerDb, metrixRating: null, metrixRatingChange: null }
      : null;

    if (player?.metrixNumber) {
      try {
        const metrixResponse = await fetch(
          `https://discgolfmetrix.com/mystat_server_rating.php?user_id=${player.metrixNumber}&other=1&course_id=0`,
        );
        const metrixData = (await metrixResponse.json()) as [
          number,
          number,
          string,
        ][][];

        const currentMetrixRating = metrixData[1].sort(
          (a, b) => b[0] - a[0],
        )[0]?.[1] ?? null;
        const previousMetrixRating = metrixData[1].sort(
          (a, b) => b[0] - a[0],
        )[1]?.[1] ?? null;

        player.metrixRating = currentMetrixRating ?? null;
        player.metrixRatingChange = previousMetrixRating
          ? currentMetrixRating - previousMetrixRating
          : null;
      } catch (error) {
        console.error('Error getting metrix data', error);
      }
    }

    return player;
  }

  async create(player: IPlayer): Promise<number> {
    const exist = await this.checkIfPlayerExist(player);
    if (exist)
      throw Error('Игрок с таким номером RDGA, PDGA или Metrix уже существует');

    const playerDb = objectToDbObject<IPlayer, IPlayerDb>(
      player,
      playerMapping,
    );

    const playerRdgaNumber = await playerDao.create(playerDb);

    return playerRdgaNumber;
  }

  async update(player: IPlayer): Promise<IPlayer> {
    const playerDb = objectToDbObject<IPlayer, IPlayerDb>(
      player,
      playerMapping,
    );

    const updatedIPlayerDb = await playerDao.update(playerDb);

    const updatedPlayer = dbObjectToObject<IPlayerDb, IPlayer>(
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
  ): Promise<IPlayer> {
    const existingPlayer = await this.checkIfPlayerExist({ rdgaNumber });
    if (!existingPlayer)
      throw Error(`Игрока с номером РДГА ${rdgaNumber} нет в базе`);

    const ratingDifference = rdgaRating - (existingPlayer.rdgaRating || 0);

    const playerDb = await playerDao.updateRdgaRating(
      rdgaNumber,
      rdgaRating,
      ratingDifference,
    );

    const player = dbObjectToObject<IPlayerDb, IPlayer>(
      playerDb,
      playerMapping,
    );

    return player;
  }

  async activatePlayerForCurrentYear(rdgaNumber: number): Promise<IPlayer> {
    const existingPlayer = await this.checkIfPlayerExist({ rdgaNumber });
    if (!existingPlayer)
      throw Error(`Игрока с номером РДГА ${rdgaNumber} нет в базе`);

    const playerDb = await playerDao.activatePlayerForCurrentYear(rdgaNumber);

    const player = dbObjectToObject<IPlayerDb, IPlayer>(
      playerDb,
      playerMapping,
    );

    return player;
  }
}

export default new PlayerService();
