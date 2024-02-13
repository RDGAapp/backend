import { z } from 'zod';

export const postSchema = z
  .strictObject({
    code: z.string(),
    author: z.string(),
    header: z.string(),
    text: z.string(),
  });

export const postPutSchema = postSchema.omit({ code: true });
