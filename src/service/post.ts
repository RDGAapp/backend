import postDao from 'dao/post';
import { IWithPagination } from 'knex-paginate';
import postMapping from 'mapping/post';
import { IBlogPost, IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';
import BaseService from './base';

class PostService extends BaseService<IBlogPostBase, IBlogPostDb, typeof postDao> {
  constructor() {
    super(postDao, postMapping);
  }

  async getAllPaginated({
    pageNumber,
    fromDateTime,
  }: {
    pageNumber: number;
    fromDateTime?: string;
  }): Promise<IWithPagination<IBlogPost[]>> {
    const posts = await postDao.getAllPaginated({ pageNumber, fromDateTime });

    return posts;
  }
}

export default new PostService();
