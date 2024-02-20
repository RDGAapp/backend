export const queriesMock = {
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  toSQL: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  toNative: jest.fn(),
  paginate: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
};

const dbMock = jest.fn().mockReturnValue(queriesMock);

export default dbMock;
