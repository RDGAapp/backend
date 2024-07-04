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
