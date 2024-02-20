import { z } from 'zod';

export const telegramAuthorizationData = z.strictObject({
  id: z.number(),
  auth_date: z.number(),
  hash: z.string(),
  username: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  photo_url: z.string().url().optional(),
});
