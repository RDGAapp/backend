import BaseService from 'service/base';
import testDao from './dao';
import { ITest, ITestDb, testMapping } from './helpers';

export default new BaseService<ITest, ITestDb, typeof testDao>(
  testDao,
  testMapping,
);
