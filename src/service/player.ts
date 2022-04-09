import playerDao from 'dao/player';
import objectToDbObject from 'helpers/objectToDbObject';
import playerMapping from 'mapping/player';
class PlayerService {
  async checkIfPlayerExist(player: Player) {
    const players = await playerDao.getAll();
    const existingPlayer = players.find(dbPlayer => (
      dbPlayer.rdgaNumber === player.rdgaNumber
      || (player.pdgaNumber && dbPlayer.pdgaNumber === player.pdgaNumber)
      || (player.metrixNumber && dbPlayer.metrixNumber === player.metrixNumber)
      )
    );

    if(!existingPlayer) return;
    throw Error('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
  }

  async getAll(): Promise<Player[]> {
    const playersDao = await playerDao.getAll();

    return playersDao;
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await playerDao.getByRdgaNumber(rdgaNumber);

    return player;
  }

  async createPlayer(player: Player): Promise<number> {
    await this.checkIfPlayerExist(player);
    const playerDb = objectToDbObject<Player, PlayerDb>(player, playerMapping);

    const playerRdgaNumber = await playerDao.createPlayer(playerDb);

    return playerRdgaNumber;
  }
}

export default new PlayerService();
