import db from 'database';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { Table } from 'types/db';
import { IBlogPost, IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';
import BaseDao from './base';

class PostDao extends BaseDao<IBlogPostBase, IBlogPostDb, 'code'> {
  #playersTableName;
  #authTableName;

  constructor() {
    super(Table.Post, postMapping, 'code');
    this.#playersTableName = Table.Player;
    this.#authTableName = Table.AuthData;
  }

  async getAllPaginated({
    pageNumber,
    fromDateTime,
  }: {
    pageNumber: number;
    fromDateTime?: string;
  }): Promise<IWithPagination<IBlogPost[]>> {
    let query = db(this._tableName)
      .leftJoin(
        this.#playersTableName,
        `${this._tableName}.author_rdga_number`,
        `${this.#playersTableName}.rdga_number`,
      )
      .leftJoin(
        this.#authTableName,
        `${this._tableName}.author_rdga_number`,
        `${this.#authTableName}.rdga_number`,
      );

    if (fromDateTime) {
      query = query.where(`${this._tableName}.created_at`, '<=', fromDateTime);
    }

    const results = query
      .select({
        ...postMapping,
        authorName: 'name',
        authorSurname: 'surname',
        authorAvatarUrl: 'telegram_photo_url',
      })
      .orderBy('created_at', 'desc')
      .paginate({
        perPage: 10,
        currentPage: pageNumber,
        isLengthAware: true,
      });

    return results;
  }

  async getByCode(code: string): Promise<IBlogPost> {
    const post = await db(this._tableName)
      .leftJoin(
        this.#playersTableName,
        `${this._tableName}.author_rdga_number`,
        `${this.#playersTableName}.rdga_number`,
      )
      .leftJoin(
        this.#authTableName,
        `${this._tableName}.author_rdga_number`,
        `${this.#authTableName}.rdga_number`,
      )
      .select({
        ...postMapping,
        authorName: 'name',
        authorSurname: 'surname',
        authorAvatarUrl: 'telegram_photo_url',
      })
      .where({ code });

    return post[0];
  }
}

export default new PostDao();
