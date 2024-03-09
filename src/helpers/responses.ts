import { Response } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import logger from './logger';

export const response500 = (response: Response, error: unknown) => {
  logger.error(error, 'Something went wrong');
  return response.status(500).send(`Something's wrong: ${error}`);
};

export const response400Schema = (response: Response, error: ZodError) =>
  response.status(400).send(fromZodError(error).toString());
