import playerService from 'service/player';
import playerDao from 'dao/player';
import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';

jest.mock('dao/player');

describe('Player Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever playerDao returns', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([]);
      const players = await playerService.getAll(1);
      expect(players).toEqual([]);
      expect(playerDao.getAll).toBeCalledTimes(1);
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player', async() => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(testPlayer);
      const player = await playerService.getByRdgaNumber(1);
      expect(player).toEqual(testPlayer);
      expect(playerDao.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toBeCalledWith(1);
    });

    test('should return null', async() => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
      const player = await playerService.getByRdgaNumber(1);
      expect(player).toEqual(null);
      expect(playerDao.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toBeCalledWith(1);
    });
  });

  describe('checkIfPlayerExist', () => {
    test('should return false if no match found', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([]);

      const exist = await playerService.checkIfPlayerExist(testPlayer);
      expect(exist).toBe(false);
    });

    test('should return true if player was found', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([testPlayer]);

      const exist = await playerService.checkIfPlayerExist(testPlayer);
      expect(exist).toBe(true);
    });
  });

  describe('createPlayer', () => {
    test('should return id', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([]);
      (playerDao.createPlayer as jest.Mock).mockReturnValueOnce(1);

      const playerId = await playerService.createPlayer(testPlayer);

      expect(playerId).toBe(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.createPlayer).toBeCalledTimes(1);
      expect(playerDao.createPlayer).toBeCalledWith(testPlayerDb);
    });

    test('should throw', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([{ ...testPlayer }]);

      const testFunction = async() => await playerService.createPlayer(testPlayer);

      expect(testFunction).rejects.toThrow('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.createPlayer).toBeCalledTimes(0);
    });
  });

  describe('updatePlayer', () => {
    test('should return updated player', async() => {
      (playerDao.updatePlayer as jest.Mock).mockReturnValueOnce(testPlayerDb);

      const updatedPlayer = await playerService.updatePlayer(testPlayer);
      
      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.updatePlayer).toBeCalledTimes(1);
      expect(playerDao.updatePlayer).toBeCalledWith(testPlayerDb);
    });
  });

  describe('deletePlayer', () => {
    test('should call dao delete player', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([{ ...testPlayer }]);

      await playerService.deletePlayer(1);

      expect(playerDao.deletePlayer).toBeCalledTimes(1);
      expect(playerDao.deletePlayer).toBeCalledWith(1);
    });

    test('should throw if player not exist', async() => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([]);

      const testFunction = async() => await playerService.deletePlayer(1);

      expect(testFunction).rejects.toThrow('Игрока с таким номером РДГА нет в базе');
      expect(playerDao.deletePlayer).toBeCalledTimes(0);
    });
  });
});
