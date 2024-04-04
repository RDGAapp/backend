import BaseDao from 'dao/base';
import { ITest, ITestDb, tableName, testMapping } from './helpers';

export default new BaseDao<ITest, ITestDb, 'test_db'>(
  tableName,
  testMapping,
  'test_db',
);
