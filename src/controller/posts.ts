import { Request, Response } from 'express';
import postsService from 'service/posts';
import { response400Joi, response500 } from 'helpers/responses';
import { postPutSchema, postSchema } from 'joiSchemas';
import { IBlogPost } from 'types/post';

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
    const { error, value: postToCreate } = postSchema.validate(request.body);

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const postHeader = await postsService.create({
        ...postToCreate,
        createdAt: new Date().toISOString(),
      });

      response.status(201).send(`Пост "${postHeader}" создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { postCode } = request;

    const { error, value: postToUpdate } = postPutSchema.validate(request.body);

    if (error) {
      console.error(error);
      return response400Joi(response, error);
    }

    try {
      const updatedPost = await postsService.update({
        ...postToUpdate,
        code: postCode,
        createdAt: new Date().toISOString(),
      } as IBlogPost);

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
