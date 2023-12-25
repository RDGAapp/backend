import postsDao from 'dao/posts';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';

class PostsService {
  async getAll({
    pageNumber,
  }: {
    pageNumber: number;
  }): Promise<IWithPagination<BlogPost[]>> {
    const posts = await postsDao.getAll({ pageNumber });

    return posts;
  }

  async create(post: BlogPost): Promise<string> {
    const postDb = objectToDbObject<BlogPost, BlogPostDb>(post, postMapping);

    const postName = await postsDao.create(postDb);

    return postName;
  }

  async update(post: BlogPost): Promise<BlogPost> {
    const postDb = objectToDbObject<BlogPost, BlogPostDb>(post, postMapping);

    const updatedPostDb = await postsDao.update(postDb);

    const updatedPost = dbObjectToObject<BlogPostDb, BlogPost>(
      updatedPostDb,
      postMapping,
    );
    return updatedPost;
  }

  async delete(code: string): Promise<void> {
    await postsDao.delete(code);
  }

  async getByCode(code: string): Promise<BlogPost> {
    return postsDao.getByCode(code);
  }
}

export default new PostsService();
