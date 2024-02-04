import fetchMock from 'jest-fetch-mock';

import playerService from 'service/players';
import playerDao from 'dao/players';

import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';

jest.mock('dao/players');
fetchMock.enableMocks();

describe('Player Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever playerDao returns', async () => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([]);
      const players = await playerService.getAll(
        1,
        'testSurname',
        'testTown',
        false,
      );
      expect(players).toEqual([]);
      expect(playerDao.getAll).toHaveBeenCalledTimes(1);
      expect(playerDao.getAll).toHaveBeenCalledWith(
        1,
        'testSurname',
        'testTown',
        false,
      );
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player with metrix info', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          [],
          [
            [1, 10, ''],
            [1, 20, ''],
          ],
          [],
        ]),
      );
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        pdgaNumber: null,
      });

      const player = await playerService.getByRdgaNumber(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixRating: 10,
        metrixRatingChange: -10,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without metrix info', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([[], [], []]));
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        pdgaNumber: null,
      });

      const player = await playerService.getByRdgaNumber(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player with pdga info', async () => {
      fetchMock.mockResponseOnce(
        '<html><small>(test text 31-Dec-2024)</small><strong>Current Rating:</strong> 955</html>',
      );
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
      });

      const player = await playerService.getByRdgaNumber(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: 955,
        pdgaActiveTo: new Date('31-Dec-2024').toISOString(),
      });
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without pdga info', async () => {
      fetchMock.mockResponseOnce('<html></html>');
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
      });

      const player = await playerService.getByRdgaNumber(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without metrixNumber and pdgaNumber', async () => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
        pdgaNumber: null,
      });

      const player = await playerService.getByRdgaNumber(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    test('should return null', async () => {
      (playerDao.getByRdgaNumber as jest.Mock).mockReturnValueOnce(null);
      const player = await playerService.getByRdgaNumber(1);
      expect(player).toEqual(null);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaNumber).toHaveBeenCalledWith(1);
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
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.create).toHaveBeenCalledTimes(1);
      expect(playerDao.create).toHaveBeenCalledWith(testPlayerDb);
    });

    test('should throw', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer },
      ]);

      const testFunction = async () => await playerService.create(testPlayer);

      expect(testFunction).rejects.toThrow(
        'Игрок с таким номером RDGA, PDGA или Metrix уже существует',
      );
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('update', () => {
    test('should return updated player', async () => {
      (playerDao.update as jest.Mock).mockReturnValueOnce(testPlayerDb);

      const updatedPlayer = await playerService.update(testPlayer);

      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.update).toHaveBeenCalledTimes(1);
      expect(playerDao.update).toHaveBeenCalledWith(testPlayerDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete player', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer },
      ]);

      await playerService.delete(1);

      expect(playerDao.delete).toHaveBeenCalledTimes(1);
      expect(playerDao.delete).toHaveBeenCalledWith(1);
    });

    test('should throw if player not exist', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );

      const testFunction = async () => await playerService.delete(1);

      expect(testFunction).rejects.toThrow(
        'Игрока с таким номером РДГА нет в базе',
      );
      expect(playerDao.delete).toHaveBeenCalledTimes(0);
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
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(playerDao.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerDao.updateRdgaRating).toHaveBeenCalledWith(1, 900, -9100);
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
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(playerDao.updateRdgaRating).toHaveBeenCalledTimes(1);
      expect(playerDao.updateRdgaRating).toHaveBeenCalledWith(1, 900, 900);
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
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.updateRdgaRating).toHaveBeenCalledTimes(0);
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should return player', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce([
        { ...testPlayer },
      ]);
      (playerDao.activatePlayerForCurrentYear as jest.Mock).mockReturnValueOnce(
        testPlayerDb,
      );

      const updatedPlayer = await playerService.activatePlayerForCurrentYear(1);

      expect(updatedPlayer).toEqual(testPlayer);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledWith(
        1,
        undefined,
        undefined,
      );
      expect(playerDao.activatePlayerForCurrentYear).toHaveBeenCalledTimes(1);
      expect(playerDao.activatePlayerForCurrentYear).toHaveBeenCalledWith(1);
    });

    test('should throw', async () => {
      (playerDao.getByRdgaPdgaMetrixNumber as jest.Mock).mockReturnValueOnce(
        [],
      );

      const testFunction = async () =>
        await playerService.activatePlayerForCurrentYear(1);

      expect(testFunction).rejects.toThrow(
        'Игрока с номером РДГА 1 нет в базе',
      );
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
      expect(playerDao.create).toHaveBeenCalledTimes(0);
    });
  });
});
