import playerService from 'service/players';
import playerDao from 'dao/players';
import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';

jest.mock('dao/players');

describe('Player Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever playerDao returns', async () => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([]);
      const players = await playerService.getAll(1, 'testSurname', 'testTown');
      expect(players).toEqual([]);
      expect(playerDao.getAll).toBeCalledTimes(1);
      expect(playerDao.getAll).toBeCalledWith(1, 'testSurname', 'testTown');
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player', async () => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(testPlayer);
      const player = await playerService.getByRdgaNumber(1);
      expect(player).toEqual(testPlayer);
      expect(playerDao.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toBeCalledWith(1);
    });

    test('should return null', async () => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
      const player = await playerService.getByRdgaNumber(1);
      expect(player).toEqual(null);
      expect(playerDao.getByRdgaNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toBeCalledWith(1);
    });
  });

  describe('checkIfPlayerExist', () => {
    test('should return false if no match found', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );

      const exist = await playerService.checkIfPlayerExist(testPlayer);
      expect(exist).toBe(null);
    });

    test('should return true if player was found', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        testPlayer,
      ]);

      const exist = await playerService.checkIfPlayerExist(testPlayer);
      expect(exist).toBe(testPlayer);
    });
  });

  describe('create', () => {
    test('should return id', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );
      (playerDao.create as jest.Mock).mockReturnValueOnce(1);

      const playerId = await playerService.create(testPlayer);

      expect(playerId).toBe(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.create).toBeCalledTimes(1);
      expect(playerDao.create).toBeCalledWith(testPlayerDb);
    });

    test('should throw', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer },
      ]);

      const testFunction = async () => await playerService.create(testPlayer);

      expect(testFunction).rejects.toThrow(
        'Игрок с таким номером RDGA, PDGA или Metrix уже существует',
      );
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.create).toBeCalledTimes(0);
    });
  });

  describe('update', () => {
    test('should return updated player', async () => {
      (playerDao.update as jest.Mock).mockReturnValueOnce(testPlayerDb);

      const updatedPlayer = await playerService.update(testPlayer);

      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.update).toBeCalledTimes(1);
      expect(playerDao.update).toBeCalledWith(testPlayerDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete player', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer },
      ]);

      await playerService.delete(1);

      expect(playerDao.delete).toBeCalledTimes(1);
      expect(playerDao.delete).toBeCalledWith(1);
    });

    test('should throw if player not exist', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );

      const testFunction = async () => await playerService.delete(1);

      expect(testFunction).rejects.toThrow(
        'Игрока с таким номером РДГА нет в базе',
      );
      expect(playerDao.delete).toBeCalledTimes(0);
    });
  });

  describe('updateRdgaRating', () => {
    test('should return player and count difference if rating already exists', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        testPlayer,
      ]);
      (playerDao.updateRdgaRating as jest.Mock).mockReturnValueOnce(
        testPlayerDb,
      );

      const updatedPlayer = await playerService.updateRdgaRating(1, 900);

      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(playerDao.updateRdgaRating).toBeCalledTimes(1);
      expect(playerDao.updateRdgaRating).toBeCalledWith(1, 900, -9100);
    });

    test("should return player and count difference if rating doesn't already exists", async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer, rdgaRating: null },
      ]);
      (playerDao.updateRdgaRating as jest.Mock).mockReturnValueOnce(
        testPlayerDb,
      );

      const updatedPlayer = await playerService.updateRdgaRating(1, 900);

      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(playerDao.updateRdgaRating).toBeCalledTimes(1);
      expect(playerDao.updateRdgaRating).toBeCalledWith(1, 900, 900);
    });

    test('should throw', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );

      const testFunction = async () =>
        await playerService.updateRdgaRating(1, 1000);

      expect(testFunction).rejects.toThrow(
        'Игрока с номером РДГА 1 нет в базе',
      );
      expect(playerDao.getByRdgaPdgaMetrixNumber).toBeCalledTimes(1);
      expect(playerDao.create).toBeCalledTimes(0);
    });
  });
});
