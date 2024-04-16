import fetchMock from 'jest-fetch-mock';

import playerService from 'service/player';
import playerDao from 'dao/player';
import playerRoleDao from 'dao/playerRole';

import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';

jest.mock('dao/player');
jest.mock('dao/playerRole');
fetchMock.enableMocks();

describe('Player Service', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByPrimaryKey', () => {
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
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        pdgaNumber: null,
      });

      const player = await playerService.getByPrimaryKey(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixRating: 10,
        metrixRatingChange: -10,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without metrix info', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([[], [], []]));
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        pdgaNumber: null,
      });

      const player = await playerService.getByPrimaryKey(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player with pdga info', async () => {
      fetchMock.mockResponseOnce(
        '<html><small>(test text 31-Dec-2024)</small><strong>Current Rating:</strong> 955</html>',
      );
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
      });

      const player = await playerService.getByPrimaryKey(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: 955,
        pdgaActiveTo: new Date('31-Dec-2024').toISOString(),
      });
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without pdga info', async () => {
      fetchMock.mockResponseOnce('<html></html>');
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
      });

      const player = await playerService.getByPrimaryKey(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    test('should return player without metrixNumber and pdgaNumber', async () => {
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce({
        ...testPlayer,
        metrixNumber: null,
        pdgaNumber: null,
      });

      const player = await playerService.getByPrimaryKey(1);

      expect(player).toEqual({
        ...testPlayer,
        metrixNumber: null,
        metrixRating: null,
        metrixRatingChange: null,
        pdgaNumber: null,
        pdgaRating: null,
        pdgaActiveTo: null,
      });
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    test('should return null', async () => {
      (playerDao.getByPrimaryKey as jest.Mock).mockReturnValueOnce(null);
      const player = await playerService.getByPrimaryKey(1);
      expect(player).toEqual(null);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
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

      await expect(testFunction).rejects.toThrow(
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

      await expect(testFunction).rejects.toThrow(
        'Игрока с номером РДГА 1 нет в базе',
      );
      expect(playerDao.getByRdgaPdgaMetrixNumber).toHaveBeenCalledTimes(1);
    });
  });

  describe('addRoleToPlayer', () => {
    test('should call create', async () => {
      (playerRoleDao.getAllByPlayer as jest.Mock).mockReturnValueOnce([
        { playerRdgaNumber: 1, roleCode: 'not_test' },
      ]);

      await playerService.addRoleToPlayer(1, 'test');

      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledWith(1);
      expect(playerRoleDao.create).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.create).toHaveBeenCalledWith({
        player_rdga_number: 1,
        role_code: 'test',
      });
    });

    test('should not call create', async () => {
      (playerRoleDao.getAllByPlayer as jest.Mock).mockReturnValueOnce([
        { playerRdgaNumber: 1, roleCode: 'test' },
      ]);

      await playerService.addRoleToPlayer(1, 'test');

      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledWith(1);
      expect(playerRoleDao.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeRoleFromPlayer', () => {
    test('should call removeRoleFromPlayer', async () => {
      await playerService.removeRoleFromPlayer(1, 'test');

      expect(playerRoleDao.removeRoleFromPlayer).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.removeRoleFromPlayer).toHaveBeenCalledWith(1, 'test');
    });
  });
});
