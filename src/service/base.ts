import BaseDao from 'dao/base';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';

class BaseService<
  TData,
  TDataDb,
  TDao extends BaseDao<TData, TDataDb, keyof TDataDb>,
> {
  protected _dao;
  protected _mapping;

  constructor(dao: TDao, mapping: Record<keyof TData, keyof TDataDb>) {
    this._dao = dao;
    this._mapping = mapping;
  }

  protected async _getAllBase(...args: unknown[]) {
    const values = await this._dao.getAll(...args);

    return values;
  }

  protected async _createBase(value: TData) {
    const valueDb = objectToDbObject<TData, TDataDb>(value, this._mapping);

    const createdValue = await this._dao.create(valueDb);

    return createdValue;
  }

  protected async _updateBase(value: TData) {
    const valueDb = objectToDbObject<TData, TDataDb>(value, this._mapping);

    const updatedValueDb = await this._dao.update(valueDb);

    const updatedValue = dbObjectToObject<TDataDb, TData>(
      updatedValueDb,
      this._mapping,
    );
    return updatedValue;
  }

  protected async _deleteBase(primaryKeyValue: TDataDb[keyof TDataDb]) {
    await this._dao.delete(primaryKeyValue);
  }

  protected async _getByPrimaryKeyBase(
    primaryKeyValue: TDataDb[keyof TDataDb],
  ) {
    return this._dao.getByPrimaryKey(primaryKeyValue);
  }

  async getAll(...args: unknown[]) {
    return this._getAllBase(...args);
  }

  async create(value: TData) {
    return this._createBase(value);
  }

  async update(value: TData) {
    return this._updateBase(value);
  }

  async delete(primaryKeyValue: TDataDb[keyof TDataDb]) {
    return this._deleteBase(primaryKeyValue);
  }

  async getByPrimaryKey(primaryKeyValue: TDataDb[keyof TDataDb]) {
    return this._getByPrimaryKeyBase(primaryKeyValue);
  }
}

export default BaseService;
