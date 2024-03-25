import { z } from 'zod';
import { playerSchema } from './players';

export const postSchema = z
  .strictObject({
    code: z.string(),
    author: z.string().nullable(),
    header: z.string(),
    text: z.string(),
    authorRdgaNumber: playerSchema.shape.rdgaNumber,
  });

export const postPutSchema = postSchema.omit({ code: true });
