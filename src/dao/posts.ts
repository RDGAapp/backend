import db from 'database';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { IBlogPost } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

class PostsDao {
  #tableName;
  #playersTableName;
  #authTableName;

  constructor() {
    this.#tableName = 'posts';
    this.#playersTableName = 'players';
    this.#authTableName = 'auth_data';
  }

  async getAll({
    pageNumber,
    fromDateTime,
  }: {
    pageNumber: number;
    fromDateTime?: string;
  }): Promise<IWithPagination<IBlogPost[]>> {
    let query = db(this.#tableName)
      .leftJoin(
        this.#playersTableName,
        `${this.#tableName}.author_rdga_number`,
        `${this.#playersTableName}.rdga_number`,
      )
      .leftJoin(
        this.#authTableName,
        `${this.#tableName}.author_rdga_number`,
        `${this.#authTableName}.rdga_number`,
      );

    if (fromDateTime) {
      query = query.where({ [`${this.#tableName}.created_at`]: fromDateTime });
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

  async create(post: IBlogPostDb): Promise<string> {
    const createdPost = await db(this.#tableName)
      .insert(post)
      .returning('header');

    return createdPost[0].header;
  }

  async update(post: Omit<IBlogPostDb, 'created_at'>): Promise<IBlogPostDb> {
    const updatedPost = await db(this.#tableName)
      .where({ code: post.code })
      .update(post)
      .returning('*');

    return updatedPost[0];
  }

  async delete(code: string): Promise<void> {
    await db(this.#tableName).where({ code }).del();
  }

  async getByCode(code: string): Promise<IBlogPost> {
    const post = await db(this.#tableName)
      .leftJoin(
        this.#playersTableName,
        `${this.#tableName}.author_rdga_number`,
        `${this.#playersTableName}.rdga_number`,
      )
      .leftJoin(
        this.#authTableName,
        `${this.#tableName}.author_rdga_number`,
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

export default new PostsDao();
