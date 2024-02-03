import db from 'database';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { IBlogPost } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

class PostsDao {
  #tableName;

  constructor() {
    this.#tableName = 'posts';
  }

  async getAll({
    pageNumber,
  }: {
    pageNumber: number;
  }): Promise<IWithPagination<IBlogPost[]>> {
    const query = db(this.#tableName);
    const results = query
      .select(postMapping)
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

  async update(post: IBlogPostDb): Promise<IBlogPostDb> {
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
    const post = await db(this.#tableName).select(postMapping).where({ code });

    return post[0];
  }
}

export default new PostsDao();
