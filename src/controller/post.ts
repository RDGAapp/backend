import { Request, Response } from 'express';
import postService from 'service/post';
import postDao from 'dao/post';
import { postPutSchema, postSchema } from 'schemas';
import BaseController from './base';
import { IBlogPostBase } from 'types/post';
import { IBlogPostDb } from 'types/postDb';

class PostController extends BaseController<
  IBlogPostBase,
  IBlogPostDb,
  'code',
  'code',
  typeof postService,
  typeof postDao
> {
  constructor() {
    super(postService, 'code', 'code', postSchema, postPutSchema, 'header');
  }

  async getAllPaginated(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;
    const fromDateTime = request.query.from?.toString();

    try {
      const posts = await postService.getAllPaginated(pageNumber, fromDateTime);

      this._response200(response, posts);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }
}

export default new PostController();
