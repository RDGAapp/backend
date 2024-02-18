import { CookieOptions, Request, Response } from 'express';
import authorizationService from 'service/authorization';
import { response500, response400Schema } from 'helpers/responses';
import { telegramAuthorizationData } from 'schemas';
import { checkTgAuthorization } from 'helpers/telegramHelper';

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

      const cookieOptions: CookieOptions = {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
      };

      return response
        .status(200)
        .json({
          rdgaNumber: authData.rdgaNumber,
          avatarUrl: authData.avatarUrl,
        })
        .cookie('authorization_hash', result.data.hash, cookieOptions)
        .cookie('rdga_number', authData.rdgaNumber, cookieOptions);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new AuthorizationController();
