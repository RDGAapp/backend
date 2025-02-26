import db from 'database';
import { IWithPagination } from 'knex-paginate';
import { Table } from 'types/db';

class BaseDao<TData, TDataDb, TPrimaryKey extends keyof TDataDb> {
  protected _tableName;
  protected _mapping;
  protected _primaryKeyName;
  protected _perPageRecords = 30;

  constructor(
    tableName: Table,
    mapping: Record<keyof TData, keyof TDataDb>,
    primaryKeyName: TPrimaryKey,
  ) {
    this._tableName = tableName;
    this._mapping = mapping;
    this._primaryKeyName = primaryKeyName;
  }

  protected async _getAllBase(): Promise<TData[]> {
    const query = db(this._tableName);

    const results = query.select(this._mapping);

    return results;
  }

  protected async _getAllPaginatedBase(
    pageNumber: number,
    ..._args: unknown[]
  ): Promise<IWithPagination<TData>> {
    const query = db(this._tableName);

    const results = query.select(this._mapping).paginate({
      perPage: this._perPageRecords,
      currentPage: pageNumber,
      isLengthAware: true,
    });

    return results;
  }

  protected async _createBase(value: TDataDb): Promise<TDataDb> {
    const createdValue = await db(this._tableName).insert(value).returning('*');

    return createdValue[0];
  }

  protected async _updateBase(value: Partial<TDataDb>): Promise<TDataDb> {
    const updatedValue = await db(this._tableName)
      .where({ [this._primaryKeyName]: value[this._primaryKeyName] })
      .update(value)
      .returning('*');

    return updatedValue[0];
  }

  protected async _deleteBase(
    primaryKeyValue: TDataDb[TPrimaryKey],
  ): Promise<void> {
    await db(this._tableName)
      .where({ [this._primaryKeyName]: primaryKeyValue })
      .del();
  }

  protected async _getByKey<TKey extends keyof TDataDb>(
    key: TKey,
    keyValue: TDataDb[TKey],
  ): Promise<TData> {
    const value = await db(this._tableName)
      .select(this._mapping)
      .where({ [key]: keyValue });

    return value[0];
  }

  protected async _getByPrimaryKeyBase(
    primaryKeyValue: TDataDb[TPrimaryKey],
  ): Promise<TData | null> {
    return this._getByKey(this._primaryKeyName, primaryKeyValue);
  }

  async getAll(..._args: unknown[]) {
    return this._getAllBase();
  }

  async getAllPaginated(pageNumber: number, ...args: unknown[]) {
    return this._getAllPaginatedBase(pageNumber, ...args);
  }

  async create(value: TDataDb) {
    return await this._createBase(value);
  }

  async update(value: Partial<TDataDb>) {
    return this._updateBase(value);
  }

  async delete(primaryKeyValue: TDataDb[TPrimaryKey]) {
    await this._deleteBase(primaryKeyValue);
  }

  async getByPrimaryKey(value: TDataDb[TPrimaryKey]) {
    return this._getByPrimaryKeyBase(value);
  }
}

export default BaseDao;
