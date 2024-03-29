const playersServiceMock = {
  checkIfPlayerExist: jest.fn(),
  getAll: jest.fn(),
  getByRdgaNumber: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateRdgaRating: jest.fn(),
  activatePlayerForCurrentYear: jest.fn(),
};

export default playersServiceMock;
