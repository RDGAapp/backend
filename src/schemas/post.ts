import { z } from 'zod';
import { playerSchema } from './player';

export const postSchema = z.strictObject({
  code: z.string(),
  author: z.string().nullable(),
  header: z.string(),
  text: z.string(),
  authorRdgaNumber: playerSchema.shape.rdgaNumber,
  createdAt: z.string().datetime(),
});

export const postPutSchema = postSchema.omit({ code: true });
