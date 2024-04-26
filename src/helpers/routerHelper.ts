import { z } from 'zod';

export const getPrimaryKeyFromParam = (param: unknown, schema: z.Schema) => {
  const result = schema.safeParse(param);

  if (result.success) return result.data;

  return null;
};
