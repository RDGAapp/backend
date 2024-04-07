const playerDaoMock = {
  getAllPaginated: jest.fn(),
  getByPrimaryKey: jest.fn(),
  getByRdgaPdgaMetrixNumber: jest.fn(),
  updateRdgaRating: jest.fn(),
  activatePlayerForCurrentYear: jest.fn(),
};

export default playerDaoMock;
