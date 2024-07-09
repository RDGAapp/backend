import { mock } from 'bun:test';

export const mockPlayerServices = () => {
  mock.module('service/player', () => ({
    default: {
      checkIfPlayerExist: mock(),
      getByPrimaryKey: mock(),
      updateRdgaRating: mock(),
      activatePlayerForCurrentYear: mock(),

      addRoleToPlayer: mock(),
      removeRoleFromPlayer: mock(),
      getAllPermissions: mock(),
      getAllRoles: mock(),

      getAll: mock(),
      getAllPaginated: mock(),
      create: mock(),
      update: mock(),
      delete: mock(),
    },
  }));
};

export const mockAuthorizationServices = () => {
  mock.module('service/authorization', () => ({
    default: {
      checkAuthData: mock(),
      updateAuthData: mock(),
      createAuthData: mock(),
    },
  }));
};

export const mockPostServices = () => {
  mock.module('service/post', () => ({
    default: {
      getAll: mock(),
      getAllPaginated: mock(),
      create: mock(),
      update: mock(),
      delete: mock(),
      getByPrimaryKey: mock(),
    },
  }));
};

export const mockTournamentServices = () => {
  mock.module('service/tournament', () => ({
    default: {
      getAll: mock(),
    },
  }));
};

export const mockAuthorizationDao = () => {
  mock.module('dao/authorization', () => ({
    default: {
      getByTelegramId: mock(),
      update: mock(),
      create: mock(),
      getByPrimaryKey: mock(),
    },
  }));
};

export const mockPlayerDao = () => {
  mock.module('dao/player', () => ({
    default: {
      getAllPaginated: mock(),
      getByPrimaryKey: mock(),
      getByRdgaPdgaMetrixNumber: mock(),
      updateRdgaRating: mock(),
      activatePlayerForCurrentYear: mock(),
    },
  }));
};

export const mockPlayerRoleDao = () => {
  mock.module('dao/playerRole', () => ({
    default: {
      create: mock(),
      getAllByPlayer: mock(),
      removeRoleFromPlayer: mock(),
      getPlayerRoles: mock(),
    },
  }));
};

export const mockDatabase = () => {
  mock.module('database', () => ({
    default: mock().mockReturnValue({
      from: mock().mockReturnThis(),
      where: mock().mockReturnThis(),
      orWhere: mock().mockReturnThis(),
      select: mock().mockReturnThis(),
      orderBy: mock().mockReturnThis(),
      toSQL: mock().mockReturnThis(),
      insert: mock().mockReturnThis(),
      into: mock().mockReturnThis(),
      returning: mock().mockReturnThis(),
      update: mock().mockReturnThis(),
      del: mock().mockReturnThis(),
      toNative: mock(),
      paginate: mock().mockReturnThis(),
      leftJoin: mock().mockReturnThis(),
    }),
  }));
};
