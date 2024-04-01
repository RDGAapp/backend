import postsDao from 'dao/post';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { IBlogPost, IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

class PostService {
  async getAll({
    pageNumber,
    fromDateTime,
  }: {
    pageNumber: number;
    fromDateTime?: string;
  }): Promise<IWithPagination<IBlogPost[]>> {
    const posts = await postsDao.getAll({ pageNumber, fromDateTime });

    return posts;
  }

  async create(post: IBlogPostBase): Promise<string> {
    const postDb = objectToDbObject<IBlogPostBase, IBlogPostDb>(
      post,
      postMapping,
    );

    const postName = await postsDao.create(postDb);

    return postName;
  }

  async update(post: Omit<IBlogPostBase, 'createdAt'>): Promise<IBlogPostBase> {
    const postDb = objectToDbObject<
      typeof post,
      Omit<IBlogPostDb, 'created_at'>
    >(post, postMapping);

    const updatedPostDb = await postsDao.update(postDb);

    const updatedPost = dbObjectToObject<IBlogPostDb, IBlogPostBase>(
      updatedPostDb,
      postMapping,
    );
    return updatedPost;
  }

  async delete(code: string): Promise<void> {
    await postsDao.delete(code);
  }

  async getByCode(code: string): Promise<IBlogPost> {
    return postsDao.getByCode(code);
  }
}

export default new PostService();
