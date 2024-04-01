import roleService from 'service/role';
import roleDao from 'dao/role';
import testRole from '__tests__/mocks/testRole';
import testRoleDb from '__tests__/mocks/testRoleDb';

jest.mock('dao/role');

describe('Role Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever postsDao returns', async () => {
      (roleDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const roles = await roleService.getAll();

      expect(roles).toEqual([]);
      expect(roleDao.getAll).toHaveBeenCalledTimes(1);
      expect(roleDao.getAll).toHaveBeenCalledWith();
    });
  });

  describe('create', () => {
    test('should return name', async () => {
      (roleDao.create as jest.Mock).mockReturnValueOnce('Test');

      const testRoleToCreate = testRole;
      const testRoleDbToCreate = testRoleDb;

      const roleName = await roleService.create(testRoleToCreate);

      expect(roleName).toBe('Test');
      expect(roleDao.create).toHaveBeenCalledTimes(1);
      expect(roleDao.create).toHaveBeenCalledWith(testRoleDbToCreate);
    });
  });

  describe('update', () => {
    test('should return updated role', async () => {
      (roleDao.update as jest.Mock).mockReturnValueOnce(testRoleDb);

      const updatedRole = await roleService.update(testRole);

      expect(updatedRole).toEqual(testRole);
      expect(roleDao.update).toHaveBeenCalledTimes(1);
      expect(roleDao.update).toHaveBeenCalledWith(testRoleDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete role', async () => {
      await roleService.delete('test');

      expect(roleDao.delete).toHaveBeenCalledTimes(1);
      expect(roleDao.delete).toHaveBeenCalledWith('test');
    });
  });

  describe('getByCode', () => {
    test('should call dao getByCode role', async () => {
      await roleService.getByCode('test');

      expect(roleDao.getByCode).toHaveBeenCalledTimes(1);
      expect(roleDao.getByCode).toHaveBeenCalledWith('test');
    });
  });
});
