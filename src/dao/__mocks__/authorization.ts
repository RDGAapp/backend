const authorizationDaoMock = {
  getByTelegramId: jest.fn(),
  getByRdgaNumber: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

export default authorizationDaoMock;
