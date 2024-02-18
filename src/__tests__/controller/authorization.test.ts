import { Request } from 'express';
import authorizationController from 'controller/authorization';
import authorizationService from 'service/authorization';
import response from '../mocks/response';
import { fullTelegramUser } from '../mocks/telegramUsers';

jest.mock('service/authorization');

describe('Authorization Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const request = { body: fullTelegramUser } as Request;

    test('should response 200', async () => {
      (authorizationService.updateAuthData as jest.Mock).mockReturnValueOnce({
        rdgaNumber: 1,
        avatarUrl: 'some_url',
      });

      await authorizationController.login(request, response);

      expect(authorizationService.updateAuthData).toHaveBeenCalledTimes(1);
      expect(authorizationService.updateAuthData).toHaveBeenCalledWith(
        fullTelegramUser,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalledWith({
        rdgaNumber: 1,
        avatarUrl: 'some_url',
      });
      expect(response.cookie).toHaveBeenCalledTimes(2);
      expect(response.cookie).toHaveBeenNthCalledWith(
        1,
        'authorization_hash',
        fullTelegramUser.hash,
        {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 24 * 60 * 60,
        },
      );
      expect(response.cookie).toHaveBeenNthCalledWith(2, 'rdga_number', 1, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
      });
    });

    test('should response 404', async () => {
      (authorizationService.updateAuthData as jest.Mock).mockReturnValueOnce(
        null,
      );

      await authorizationController.login(request, response);

      expect(authorizationService.updateAuthData).toHaveBeenCalledTimes(1);
      expect(authorizationService.updateAuthData).toHaveBeenCalledWith(
        fullTelegramUser,
      );
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('No such authorization');
    });

    test('should response 400', async () => {
      await authorizationController.login(
        { body: { ...fullTelegramUser, hash: 'broken' } } as Request,
        response,
      );

      expect(authorizationService.updateAuthData).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith('Your data is corrupted');
    });

    test('should response 400', async () => {
      await authorizationController.login(
        { body: { ...fullTelegramUser, id: 'test' } } as Request,
        response,
      );

      expect(authorizationService.updateAuthData).toHaveBeenCalledTimes(0);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Validation error: Expected number, received string at "id"',
      );
    });

    test('should handle service throw with 500', async () => {
      (authorizationService.updateAuthData as jest.Mock).mockImplementationOnce(
        () => {
          throw new Error('Test');
        },
      );

      await authorizationController.login(request, response);

      expect(authorizationService.updateAuthData).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledTimes(0);
      expect(response.send).toHaveBeenCalledTimes(1);
      expect(response.send).toHaveBeenCalledWith(
        'Что-то пошло не так: Error: Test',
      );
    });
  });
});
