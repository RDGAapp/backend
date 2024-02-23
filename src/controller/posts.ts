import { Request, Response } from 'express';
import postsService from 'service/posts';
import { response400Schema, response500 } from 'helpers/responses';
import { postPutSchema, postSchema } from 'schemas';

class PostsController {
  async getAll(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;

    try {
      const posts = await postsService.getAll({ pageNumber });

      return response.status(200).json(posts);
    } catch (error) {
      return response500(response, error);
    }
  }

  async create(request: Request, response: Response) {
    const result = postSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const postHeader = await postsService.create({
        ...result.data,
        createdAt: new Date().toISOString(),
      });

      response.status(201).send(`Пост "${postHeader}" создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { postCode } = request;

    const result = postPutSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const updatedPost = await postsService.update({
        ...result.data,
        code: postCode,
      });

      return response.status(200).json(updatedPost);
    } catch (error) {
      return response500(response, error);
    }
  }

  async delete(request: Request, response: Response) {
    const { postCode } = request;

    try {
      await postsService.delete(postCode);

      return response.status(200).send(`Пост ${postCode} удален`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async getByCode(request: Request, response: Response) {
    const { postCode } = request;

    try {
      const post = await postsService.getByCode(postCode);

      return response.status(200).json(post);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new PostsController();
