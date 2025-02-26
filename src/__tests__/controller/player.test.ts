import { describe, expect, test, afterEach, jest } from 'bun:test';
import playerController from 'controller/player';
import playerService from 'service/player';
import response from '../mocks/response';
import testPlayer from '../mocks/testPlayer';
import { RdgaRequest } from 'controller/base';
import { IPlayerBase } from 'types/player';
import { mockPlayerServices } from '__tests__/mocks/modules';

type Request = RdgaRequest<IPlayerBase, 'rdgaNumber'>;

mockPlayerServices();

describe('Player Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200 and replace query with default values', async () => {
      (playerService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPaginated).toHaveBeenCalledWith(
        1,
        '',
        '',
        false,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should response 200 and use query values', async () => {
      (playerService.getAllPaginated as jest.Mock).mockReturnValueOnce([]);
      const request = {
        query: {
          page: 2,
          surname: 'testSurname',
          town: 'Somewhere',
          onlyActive: 'true',
        },
      } as unknown as Request;

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPaginated).toHaveBeenCalledWith(
        2,
        'testSurname',
        'Somewhere',
        true,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (playerService.getAllPaginated as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.getAll(request, response);

      expect(playerService.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should activate with 200 response', async () => {
      const request = {
        primaryKeyValue: 1,
      } as Request;
      (
        playerService.activatePlayerForCurrentYear as jest.Mock
      ).mockReturnValueOnce(testPlayer);

      await playerController.activatePlayerForCurrentYear(request, response);

      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledTimes(
        1,
      );
      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledWith(
        1,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testPlayer);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        primaryKeyValue: 1,
      } as Request;
      (
        playerService.activatePlayerForCurrentYear as jest.Mock
      ).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.activatePlayerForCurrentYear(request, response);

      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledTimes(
        1,
      );
      expect(playerService.activatePlayerForCurrentYear).toHaveBeenCalledWith(
        1,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('addRoleToPlayer', () => {
    test.todo('should response 200', async () => {
      const request = { primaryKeyValue: 1, body: ['su'] } as Request;

      await playerController.addRoleToPlayer(request, response);

      expect(playerService.addRoleToPlayer).toHaveBeenCalledTimes(1);
      expect(playerService.addRoleToPlayer).toHaveBeenCalledWith(1, 'su');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Value "su" added');
    });

    test.todo('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 1, body: ['su'] } as Request;
      (playerService.addRoleToPlayer as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.addRoleToPlayer(request, response);

      expect(playerService.addRoleToPlayer).toHaveBeenCalledTimes(1);
      expect(playerService.addRoleToPlayer).toHaveBeenCalledWith(1, 'su');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if primaryKey empty', async () => {
      const request = { primaryKeyValue: 0, body: [] } as Request;

      await playerController.addRoleToPlayer(request, response);

      expect(playerService.addRoleToPlayer).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key or role code value provided",
      );
    });

    test('should return 400 if roleCode empty', async () => {
      const request = { primaryKeyValue: 1, body: [] } as Request;

      await playerController.addRoleToPlayer(request, response);

      expect(playerService.addRoleToPlayer).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key or role code value provided",
      );
    });
  });

  describe('removeRoleFromPlayer', () => {
    test.todo('should response 200', async () => {
      const request = { primaryKeyValue: 1, body: ['su'] } as Request;

      await playerController.removeRoleFromPlayer(request, response);

      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledTimes(1);
      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledWith(1, 'su');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Value "su" removed');
    });

    test.todo('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 1, body: ['su'] } as Request;
      (playerService.removeRoleFromPlayer as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.removeRoleFromPlayer(request, response);

      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledTimes(1);
      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledWith(1, 'su');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if primaryKey empty', async () => {
      const request = { primaryKeyValue: 0, body: [] } as Request;

      await playerController.removeRoleFromPlayer(request, response);

      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key or role code value provided",
      );
    });

    test('should return 400 if roleCode empty', async () => {
      const request = { primaryKeyValue: 1, body: [] } as Request;

      await playerController.removeRoleFromPlayer(request, response);

      expect(playerService.removeRoleFromPlayer).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key or role code value provided",
      );
    });
  });

  describe('getAllRoles', () => {
    test.todo('should response 200', async () => {
      (playerService.getAllRoles as jest.Mock).mockReturnValueOnce([]);
      const request = { primaryKeyValue: 1 } as Request;

      await playerController.getPlayerRoles(request, response);

      expect(playerService.getAllRoles).toHaveBeenCalledTimes(1);
      expect(playerService.getAllRoles).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test.todo('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 1 } as Request;
      (playerService.getAllRoles as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await playerController.getPlayerRoles(request, response);

      expect(playerService.getAllRoles).toHaveBeenCalledTimes(1);
      expect(playerService.getAllRoles).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if primaryKey empty', async () => {
      const request = { primaryKeyValue: 0 } as Request;

      await playerController.getPlayerRoles(request, response);

      expect(playerService.getAllRoles).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });

  describe('getAllPermissions', () => {
    test.todo('should response 200', async () => {
      const mockedPermissions = {
        canManagePlayers: true,
        canManageTournaments: true,
        canManageBlogPost: false,
        canManageBlogPosts: true,
        canManageRoles: false,
        canAssignRoles: true,
      };
      (playerService.getAllPermissions as jest.Mock).mockReturnValueOnce(
        mockedPermissions,
      );
      const request = { primaryKeyValue: 1 } as Request;

      await playerController.getPlayerPermissions(request, response);

      expect(playerService.getAllPermissions).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPermissions).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(mockedPermissions);
    });

    test.todo('should handle service throw with 500', async () => {
      const request = { primaryKeyValue: 1 } as Request;
      (playerService.getAllPermissions as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await playerController.getPlayerPermissions(request, response);

      expect(playerService.getAllPermissions).toHaveBeenCalledTimes(1);
      expect(playerService.getAllPermissions).toHaveBeenCalledWith(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if primaryKey empty', async () => {
      const request = { primaryKeyValue: 0 } as Request;

      await playerController.getPlayerPermissions(request, response);

      expect(playerService.getAllPermissions).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: No primary key value provided",
      );
    });
  });
});
