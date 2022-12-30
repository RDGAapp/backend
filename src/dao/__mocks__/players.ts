const playersDaoMock = {
  getAll: jest.fn(),
  getByRdgaNumber: jest.fn(),
  getByRdgaPdgaMetrixNumber: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  updateRdgaRating: jest.fn(),
};

export default playersDaoMock;
