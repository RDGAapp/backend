import { describe, expect, test, afterEach, beforeEach, jest } from 'bun:test';
import { mock as fetchMock, clearMocks as clearFetchMock } from 'bun-bagel';

import playerService from 'service/player';
import playerDao from 'dao/player';
import playerRoleDao from 'dao/playerRole';

import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';
import { mockPlayerDao, mockPlayerRoleDao } from '__tests__/mocks/modules';
import { IPlayerExtended } from 'types/player';

mockPlayerDao();
mockPlayerRoleDao();

describe('Player Service', () => {
  beforeEach(() => {
    clearFetchMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByPrimaryKey', () => {
    test('should return player with metrix info', async () => {
      fetchMock(
        'https://discgolfmetrix.com/mystat_server_rating.php?user_id=1&other=1&course_id=0',
        {
          data: [
            [],
            [
              [1, 10, ''],
              [1, 20, ''],
            ],
            [],
          ],
        },
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
      } as IPlayerExtended);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test('should return player without metrix info', async () => {
      fetchMock(
        'https://discgolfmetrix.com/mystat_server_rating.php?user_id=1&other=1&course_id=0',
        {
          data: [[], [], []],
        },
      );
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
      } as IPlayerExtended);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test('should return player with pdga info', async () => {
      fetchMock('https://www.pdga.com/player/1', {
        data: '<html><small>(test text 31-Dec-2024)</small><strong>Current Rating:</strong> 955</html>',
      });
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
      } as IPlayerExtended);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
    });

    test('should return player without pdga info', async () => {
      fetchMock('https://www.pdga.com/player/1', {
        data: '<html></html>',
      });
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
      } as IPlayerExtended);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
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
      } as IPlayerExtended);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledTimes(1);
      expect(playerDao.getByPrimaryKey).toHaveBeenCalledWith(1);
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

      expect(playerService.updateRdgaRating(1, 1000)).rejects.toThrow(
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

      expect(playerService.activatePlayerForCurrentYear(1)).rejects.toThrow(
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

    test('should throw and not call create', async () => {
      (playerRoleDao.getAllByPlayer as jest.Mock).mockReturnValueOnce([
        { playerRdgaNumber: 1, roleCode: 'test' },
      ]);

      expect(playerService.addRoleToPlayer(1, 'test')).rejects.toThrow(
        'Player already has this role',
      );
      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.getAllByPlayer).toHaveBeenCalledWith(1);
      expect(playerRoleDao.create).toHaveBeenCalledTimes(0);
    });
  });

  describe('removeRoleFromPlayer', () => {
    test('should call removeRoleFromPlayer', async () => {
      await playerService.removeRoleFromPlayer(1, 'test');

      expect(playerRoleDao.removeRoleFromPlayer).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.removeRoleFromPlayer).toHaveBeenCalledWith(
        1,
        'test',
      );
    });
  });

  describe('getAllPermissions', () => {
    test('should call getPlayerRoles', async () => {
      (playerRoleDao.getPlayerRoles as jest.Mock).mockReturnValueOnce([
        {
          code: 'test',
          name: 'test name',
          canManagePlayers: true,
          canManageTournaments: true,
          canManageBlogPost: false,
          canManageBlogPosts: true,
          canManageRoles: false,
          canAssignRoles: true,
        },
      ]);

      const permissions = await playerService.getAllPermissions(1);

      expect(permissions).toEqual({
        canManagePlayers: true,
        canManageTournaments: true,
        canManageBlogPost: false,
        canManageBlogPosts: true,
        canManageRoles: false,
        canAssignRoles: true,
      });
      expect(playerRoleDao.getPlayerRoles).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.getPlayerRoles).toHaveBeenCalledWith(1);
    });
  });

  describe('getAllRoles', () => {
    test('should call getPlayerRoles', async () => {
      const mockedRoles = [
        {
          code: 'test',
          name: 'test name',
          canManagePlayers: true,
          canManageTournaments: true,
          canManageBlogPost: false,
          canManageBlogPosts: true,
          canManageRoles: false,
          canAssignRoles: true,
        },
      ];
      (playerRoleDao.getPlayerRoles as jest.Mock).mockReturnValueOnce(
        mockedRoles,
      );

      const roles = await playerService.getAllRoles(1);

      expect(roles).toEqual(mockedRoles as typeof roles);
      expect(playerRoleDao.getPlayerRoles).toHaveBeenCalledTimes(1);
      expect(playerRoleDao.getPlayerRoles).toHaveBeenCalledWith(1);
    });
  });
});
