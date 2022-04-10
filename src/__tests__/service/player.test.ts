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
      const players = await playerService.getAll();
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
    test('should pass if no match found', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([{ ...testPlayer, rdgaNumber: 2, pdgaNumber: 2, metrixNumber: 2 }]);

      const testFunction = async() => await playerService.checkIfPlayerExist(testPlayer);
      expect(testFunction).not.toThrow();
    });

    test('should throw if found same RDGA number', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([{ ...testPlayer, pdgaNumber: 2, metrixNumber: 2 }]);

      const testFunction = async() => playerService.checkIfPlayerExist(testPlayer);
      expect(testFunction).rejects.toThrow('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
    });

    test('should throw if found same PDGA number', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([{ ...testPlayer, rdgaNumber: 2, metrixNumber: 2 }]);

      const testFunction = async() => playerService.checkIfPlayerExist(testPlayer);
      expect(testFunction).rejects.toThrow('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
    });

    test('should throw if found same Metrix number', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([{ ...testPlayer, rdgaNumber: 2, pdgaNumber: 2 }]);

      const testFunction = async() => playerService.checkIfPlayerExist(testPlayer);
      expect(testFunction).rejects.toThrow('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
    });
  });

  describe('createPlayer', () => {
    test('should return id', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([]);
      (playerDao.createPlayer as jest.Mock).mockReturnValueOnce(1);

      const playerId = await playerService.createPlayer(testPlayer);

      expect(playerId).toBe(1);
      expect(playerDao.getAll).toBeCalledTimes(1);
      expect(playerDao.createPlayer).toBeCalledTimes(1);
      expect(playerDao.createPlayer).toBeCalledWith(testPlayerDb);
    });

    test('should throw', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([{ ...testPlayer }]);

      const testFunction = async() => await playerService.createPlayer(testPlayer);

      expect(testFunction).rejects.toThrow('Игрок с таким номером RDGA, PDGA или Metrix уже существует');
      expect(playerDao.getAll).toBeCalledTimes(1);
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
});
