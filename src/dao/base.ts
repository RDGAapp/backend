import db from 'database';
import { Table } from 'types/db';

class BaseDao<TData, TDataDb, TPrimaryKey extends keyof TDataDb> {
  protected _tableName;
  protected _mapping;
  protected _primaryKeyName;

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

  protected async _createBase<TKey extends keyof TDataDb>(
    value: TDataDb,
    returningField: TKey,
  ): Promise<TDataDb[TKey]> {
    const createdValue = await db(this._tableName)
      .insert(value)
      .returning(returningField.toString());

    return createdValue[0][returningField];
  }

  protected async _updateBase(value: TDataDb): Promise<TDataDb> {
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

  protected async _getByPrimaryKeyBase(
    primaryKeyValue: TDataDb[TPrimaryKey],
  ): Promise<TData> {
    const value = await db(this._tableName)
      .select(this._mapping)
      .where({ [this._primaryKeyName]: primaryKeyValue });

    return value[0];
  }

  async getAll(..._args: unknown[]): Promise<TData[]> {
    return this._getAllBase();
  }

  async create(value: TDataDb) {
    return this._createBase(value, this._primaryKeyName);
  }

  async update(value: TDataDb) {
    return this._updateBase(value);
  }

  async delete(primaryKeyValue: TDataDb[TPrimaryKey]): Promise<void> {
    await this._deleteBase(primaryKeyValue);
  }

  async getByPrimaryKey(value: TDataDb[TPrimaryKey]) {
    return this._getByPrimaryKeyBase(value);
  }
}

export default BaseDao;
