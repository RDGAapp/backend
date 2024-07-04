export const queriesMock = {
  from: mock().mockReturnThis(),
  where: mock().mockReturnThis(),
  orWhere: mock().mockReturnThis(),
  select: mock().mockReturnThis(),
  orderBy: mock().mockReturnThis(),
  toSQL: mock().mockReturnThis(),
  insert: mock().mockReturnThis(),
  into: mock().mockReturnThis(),
  returning: mock().mockReturnThis(),
  update: mock().mockReturnThis(),
  del: mock().mockReturnThis(),
  toNative: mock(),
  paginate: mock().mockReturnThis(),
  leftJoin: mock().mockReturnThis(),
};

const dbMock = mock().mockReturnValue(queriesMock);

export default dbMock;
