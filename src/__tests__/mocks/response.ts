import { Response } from 'express';
import { mock } from 'bun:test';

const response = {
  status: mock().mockReturnThis(),
  json: mock().mockReturnThis(),
  send: mock().mockReturnThis(),
  cookie: mock().mockReturnThis(),
  clearCookie: mock().mockReturnThis(),
} as unknown as Response;

export default response;
