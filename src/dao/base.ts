import { db } from 'database';
import { count, eq } from 'drizzle-orm';
import { PgTableWithColumns, TableConfig } from 'drizzle-orm/pg-core';

class BaseDao<
  TPrimaryKey extends keyof TTableConfig['columns'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TTableConfig extends TableConfig = any,
> {
  protected _table;
  protected _primaryKeyName;
  protected _perPageRecords = 30;

  constructor(
    table: PgTableWithColumns<TTableConfig>,
    primaryKeyName: keyof TTableConfig['columns'],
  ) {
    this._table = table;
    this._primaryKeyName = primaryKeyName;
  }

  protected async _getAllBase() {
    const results = db.select().from(this._table);

    return results;
  }

  protected async _getAllPaginatedBase(
    pageNumber: number,
    ..._args: unknown[]
  ) {
    const results = db
      .select({ total: count(), records: this._table })
      .from(this._table)
      .limit(this._perPageRecords)
      .offset((pageNumber - 1) * this._perPageRecords);

    return results;
  }

  protected async _createBase(
    value: Record<string, any>,
  ) {
    const createdValue = await db.insert(this._table).values(value).returning();

    return createdValue[0];
  }

  protected async _updateBase(value: Partial<typeof this._table>) {
    const updatedValue = await db
      .update(this._table)
      .set(value)
      .where(eq(this._table[this._primaryKeyName], value[this._primaryKeyName]))
      .returning();

    return updatedValue[0];
  }

  protected async _deleteBase(
    primaryKeyValue: (typeof this._table)[TPrimaryKey],
  ): Promise<void> {
    await db
      .delete(this._table)
      .where(eq(this._table[this._primaryKeyName], primaryKeyValue));
  }

  protected async _getByKey<TKey extends keyof typeof this._primaryKeyName>(
    key: TKey,
    keyValue: (typeof this._table)[TKey],
  ) {
    const value = await db
      .select()
      .from(this._table)
      .where(eq(this._table[key], keyValue));

    return value[0];
  }

  protected async _getByPrimaryKeyBase(
    primaryKeyValue: (typeof this._table)[TPrimaryKey],
  ) {
    return this._getByKey(this._primaryKeyName, primaryKeyValue);
  }

  async getAll(..._args: unknown[]) {
    return this._getAllBase();
  }

  async getAllPaginated(pageNumber: number, ...args: unknown[]) {
    return this._getAllPaginatedBase(pageNumber, ...args);
  }

  async create(value: typeof this._table) {
    return await this._createBase(value);
  }

  async update(value: Partial<typeof this._table>) {
    return this._updateBase(value);
  }

  async delete(primaryKeyValue: (typeof this._table)[TPrimaryKey]) {
    await this._deleteBase(primaryKeyValue);
  }

  async getByPrimaryKey(value: (typeof this._table)[TPrimaryKey]) {
    return this._getByPrimaryKeyBase(value);
  }
}

export default BaseDao;
