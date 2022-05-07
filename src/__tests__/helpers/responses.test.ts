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
    test('should response 400 with message for м', () => {
      response400(response, 'Test', 'not test', 'м');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должен быть not test');
    });

    test('should response 400 with message for ж', () => {
      response400(response, 'Test', 'not test', 'ж');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должна быть not test');
    });

    test('should response 400 with message for ср', () => {
      response400(response, 'Test', 'not test', 'ср');

      expect(response.status).toBeCalledTimes(1);
      expect(response.status).toBeCalledWith(400);
      expect(response.send).toBeCalledTimes(1);
      expect(response.send).toBeCalledWith('Test должно быть not test');
    });
  });
});
