import { ValidationError } from 'joi';
import { response500, response400Joi, response400 } from 'helpers/responses';
import response from '../mocks/response';

describe('handleGlobalError helper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('response500', () => {
    test('should response 500 with message', () => {
      const error = new Error('test');
      response500(response, error);

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(500);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Что-то пошло не так: Error: test');
    });
  });

  describe('response400Joi', () => {
    test('should response 400 with message', () => {
      const error = { details: [{ message: 'test' }] } as unknown as ValidationError;
      response400Joi(response, error);

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Проверьте данные: test');
    });
  });

  describe('response400', () => {
    test('should response 400 with message for he', () => {
      response400(response, 'Test', 'not test', 'he');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должен быть not test');
    });

    test('should response 400 with message for she', () => {
      response400(response, 'Test', 'not test', 'she');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должна быть not test');
    });

    test('should response 400 with message for it', () => {
      response400(response, 'Test', 'not test', 'it');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должно быть not test');
    });
  });
});
