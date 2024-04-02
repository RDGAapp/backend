import { Request } from 'express';
import roleController from 'controller/role';
import roleService from 'service/role';
import response from '../mocks/response';
import testRole from '__tests__/mocks/testRole';

jest.mock('service/role');

describe('Role Controller', () => {
  const testRoleWithoutCode = {
    name: testRole.name,
    canManagePlayers: testRole.canManagePlayers,
    canManageTournaments: testRole.canManageTournaments,
    canManageBlogPost: testRole.canManageBlogPost,
    canManageBlogPosts: testRole.canManageBlogPosts,
    canManageRoles: testRole.canManageRoles,
    canAssignRoles: testRole.canAssignRoles,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-02'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getAll', () => {
    const request = { query: {} } as Request;

    test('should response 200', async () => {
      (roleService.getAll as jest.Mock).mockReturnValueOnce([]);

      await roleController.getAll(request, response);

      expect(roleService.getAll).toHaveBeenCalledTimes(1);
      expect(roleService.getAll).toHaveBeenCalledWith();
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith([]);
    });

    test('should handle service throw with 500', async () => {
      (roleService.getAll as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await roleController.getAll(request, response);

      expect(roleService.getAll).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('create', () => {
    test('should create with 201 response', async () => {
      const request = {
        body: { ...testRole },
      } as unknown as Request;
      (roleService.create as jest.Mock).mockReturnValueOnce(1);

      await roleController.create(request, response);

      expect(roleService.create).toHaveBeenCalledTimes(1);
      expect(roleService.create).toHaveBeenCalledWith({
        ...testRole,
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Role "1" created');
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testRole },
      } as unknown as Request;
      (roleService.create as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await roleController.create(request, response);

      expect(roleService.create).toHaveBeenCalledTimes(1);
      expect(roleService.create).toHaveBeenCalledWith({
        ...testRole,
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testRole, name: 1 },
      } as unknown as Request;

      await roleController.create(request, response);

      expect(roleService.create).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Validation error: Expected string, received number at "name"',
      );
    });
  });

  describe('update', () => {
    test('should update with 200 response', async () => {
      const request = {
        body: { ...testRoleWithoutCode },
        roleCode: 'test',
      } as unknown as Request;

      (roleService.update as jest.Mock).mockReturnValueOnce(testRole);

      await roleController.update(request, response);

      expect(roleService.update).toHaveBeenCalledTimes(1);
      expect(roleService.update).toHaveBeenCalledWith({
        ...testRoleWithoutCode,
        code: 'test',
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith(testRole);
    });

    test('should return 500 if something went wrong', async () => {
      const request = {
        body: { ...testRoleWithoutCode },
        roleCode: 'test',
      } as unknown as Request;
      delete request.body.rdgaNumber;
      (roleService.update as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await roleController.update(request, response);

      expect(roleService.update).toHaveBeenCalledTimes(1);
      expect(roleService.update).toHaveBeenCalledWith({
        ...testRoleWithoutCode,
        code: 'test',
      });
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });

    test('should return 400 if data is corrupted', async () => {
      const request = {
        body: { ...testRole },
        roleCode: 'test',
      } as unknown as Request;

      await roleController.update(request, response);

      expect(roleService.update).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Validation error: Unrecognized key(s) in object: 'code'",
      );
    });
  });

  describe('delete', () => {
    test('should response 200 if post found and deleted', async () => {
      const request = { roleCode: 'test' } as unknown as Request;

      await roleController.delete(request, response);

      expect(roleService.delete).toHaveBeenCalledTimes(1);
      expect(roleService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Role test deleted');
    });

    test('should handle service throw with 500', async () => {
      const request = { roleCode: 'test' } as unknown as Request;
      (roleService.delete as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await roleController.delete(request, response);

      expect(roleService.delete).toHaveBeenCalledTimes(1);
      expect(roleService.delete).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });

  describe('getByCode', () => {
    test('should response 200 if post found', async () => {
      (roleService.getByCode as jest.Mock).mockReturnValueOnce({
        code: 'test',
      });
      const request = { roleCode: 'test' } as unknown as Request;

      await roleController.getByCode(request, response);

      expect(roleService.getByCode).toHaveBeenCalledTimes(1);
      expect(roleService.getByCode).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({ code: 'test' });
    });

    test('should handle service throw with 500', async () => {
      const request = { roleCode: 'test' } as unknown as Request;
      (roleService.getByCode as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test');
      });

      await roleController.getByCode(request, response);

      expect(roleService.getByCode).toHaveBeenCalledTimes(1);
      expect(roleService.getByCode).toHaveBeenCalledWith('test');
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        "Something's wrong: Error: Test",
      );
    });
  });
});
