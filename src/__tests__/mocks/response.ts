import { Response } from 'express';

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

export default response;