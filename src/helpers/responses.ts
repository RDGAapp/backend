import { Response } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export const response500 = (response: Response, error: unknown) =>
  response.status(500).send(`Что-то пошло не так: ${error}`);

export const response400Schema = (response: Response, error: ZodError) =>
  response.status(400).send(fromZodError(error).toString());
