const playerServiceMock = {
  checkIfPlayerExist: jest.fn(),
  getByPrimaryKey: jest.fn(),
  updateRdgaRating: jest.fn(),
  activatePlayerForCurrentYear: jest.fn(),

  addRoleToPlayer: jest.fn(),
  removeRoleFromPlayer: jest.fn(),

  getAll: jest.fn(),
  getAllPaginated: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export default playerServiceMock;
