import Joi from 'joi';
import { IBlogPost } from 'types/post';

export const postSchema: Joi.ObjectSchema<IBlogPost> = Joi.object().keys({
  code: Joi.string().required(),
  author: Joi.string().required(),
  header: Joi.string().required(),
  text: Joi.string().required(),
});

export const postPutSchema: Joi.ObjectSchema<Partial<IBlogPost>> =
  Joi.object().keys({
    author: Joi.string().required(),
    header: Joi.string().required(),
    text: Joi.string().required(),
  });
