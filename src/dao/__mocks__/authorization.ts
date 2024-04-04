const authorizationDaoMock = {
  getByTelegramId: jest.fn(),
  getByPrimaryKey: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

export default authorizationDaoMock;
