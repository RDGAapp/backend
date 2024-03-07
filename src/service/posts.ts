import postsDao from 'dao/posts';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { IBlogPost } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

class PostsService {
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

  async create(post: IBlogPost): Promise<string> {
    const postDb = objectToDbObject<IBlogPost, IBlogPostDb>(post, postMapping);

    const postName = await postsDao.create(postDb);

    return postName;
  }

  async update(post: Omit<IBlogPost, 'createdAt'>): Promise<IBlogPost> {
    const postDb = objectToDbObject<
      typeof post,
      Omit<IBlogPostDb, 'created_at'>
    >(post, postMapping);

    const updatedPostDb = await postsDao.update(postDb);

    const updatedPost = dbObjectToObject<IBlogPostDb, IBlogPost>(
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

export default new PostsService();
