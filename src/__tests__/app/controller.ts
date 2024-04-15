import BaseController from 'controller/base';
import { ITest, ITestDb } from './helpers';
import testService from './service';
import testDao from './dao';
import { z } from 'zod';

export default new BaseController<
  ITest,
  ITestDb,
  'test',
  'test_db',
  typeof testService,
  typeof testDao
>(
  testService,
  'test',
  'test_db',
  z.strictObject({ test: z.string() }),
  z.strictObject({ test: z.string() }),
  'display_db',
);

export const controllerWoDisplayKey = new BaseController<
  ITest,
  ITestDb,
  'test',
  'test_db',
  typeof testService,
  typeof testDao
>(
  testService,
  'test',
  'test_db',
  z.strictObject({ test: z.string() }),
  z.strictObject({ test: z.string() }),
);
