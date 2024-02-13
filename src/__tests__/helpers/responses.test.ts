import { response500, response400Schema } from 'helpers/responses';
import response from '../mocks/response';
import { ZodError } from 'zod';

describe('handleGlobalError helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('response500', () => {
    test('should response 500 with message', () => {
      const error = new Error('test');
      response500(response, error);

      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: test',
      );
    });
  });

  describe('response400Schema', () => {
    test('should response 400 with message', () => {
      const error = new ZodError([
        {
          code: 'custom',
          path: ['confirm'],
          message: "Passwords don't match",
        },
      ]);
      response400Schema(response, error);

      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Validation error: Passwords don\'t match at "confirm"',
      );
    });
  });
});
