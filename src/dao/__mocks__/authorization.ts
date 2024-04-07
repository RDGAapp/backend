const authorizationDaoMock = {
  getByTelegramId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  getByPrimaryKey: jest.fn(),
};

export default authorizationDaoMock;
