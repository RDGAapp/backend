import postDao from 'dao/post';
import postMapping from 'mapping/post';
import { IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';
import BaseService from './base';

class PostService extends BaseService<
  IBlogPostBase,
  IBlogPostDb,
  typeof postDao
> {
  constructor() {
    super(postDao, postMapping);
  }
}

export default new PostService();
