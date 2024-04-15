import { Table } from 'types/db';

export const tableName = 'test' as Table;
export const testMapping = { test: 'test_db' } as const;

export interface ITest {
  test: string;
}

export interface ITestDb {
  test_db: string;
  display_db: string;
}
