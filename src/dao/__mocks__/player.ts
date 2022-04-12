const playerDaoMock = {
  getAll: jest.fn(),
  getByRdgaNumber: jest.fn(),
  createPlayer: jest.fn(),
  updatePlayer: jest.fn(),
  deletePlayer: jest.fn(),
};

export default playerDaoMock;
