import { CookieOptions, Request, Response } from 'express';
import authorizationService from 'service/authorization';
import { response500, response400Schema } from 'helpers/responses';
import { telegramAuthorizationData } from 'schemas';
import { checkTgAuthorization } from 'helpers/telegramHelper';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60,
};

class AuthorizationController {
  async login(request: Request, response: Response) {
    const result = telegramAuthorizationData.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    if (!checkTgAuthorization(result.data)) {
      return response.status(400).send('Your data is corrupted');
    }

    try {
      const authData = await authorizationService.updateAuthData(result.data);

      if (!authData) {
        return response.status(404).send('No such authorization');
      }

      return response
        .cookie('authorization_hash', result.data.hash, cookieOptions)
        .cookie('rdga_number', authData.rdgaNumber, cookieOptions)
        .status(200)
        .json({
          rdgaNumber: authData.rdgaNumber,
          avatarUrl: authData.avatarUrl,
        });
    } catch (error) {
      return response500(response, error);
    }
  }

  async register(request: Request, response: Response) {
    const { rdgaNumber, ...tgAuthData } = request.body;
    if (isNaN(Number(rdgaNumber))) {
      return response
        .status(400)
        .send('RDGA number is incorrect or not defined');
    }

    const result = telegramAuthorizationData.safeParse(tgAuthData);
    if (!result.success) {
      return response400Schema(response, result.error);
    }

    if (!checkTgAuthorization(result.data)) {
      return response.status(400).send('Your data is corrupted');
    }

    try {
      const authData = await authorizationService.createAuthData(
        Number(rdgaNumber),
        result.data,
      );

      return response
        .cookie('authorization_hash', result.data.hash, cookieOptions)
        .cookie('rdga_number', authData.rdgaNumber, cookieOptions)
        .status(200)
        .json({
          rdgaNumber: authData.rdgaNumber,
          avatarUrl: authData.avatarUrl,
        });
    } catch (error) {
      return response500(response, error);
    }
  }

  async logout(request: Request, response: Response) {
    return response
      .clearCookie('authorization_hash')
      .clearCookie('rdga_number')
      .status(200)
      .send();
  }
}

export default new AuthorizationController();
