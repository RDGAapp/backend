const postDaoMock = {
  getAll: jest.fn(),
  getAllPaginated: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByPrimaryKey: jest.fn(),
};

export default postDaoMock;
