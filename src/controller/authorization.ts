import { CookieOptions, Request, Response } from 'express';
import authorizationService from 'service/authorization';
import authorizationDao from 'dao/authorization';
import { telegramAuthorizationData } from 'schemas';
import { checkTgAuthorization } from 'helpers/telegramHelper';
import BaseController from './base';
import { IAuthData } from 'types/authData';
import { IAuthDataDb } from 'types/authDataDb';
import { z } from 'zod';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

const setCookie = (
  response: Response,
  hash: string,
  rdgaNumber: number,
): Response =>
  response
    .cookie('authorization_hash', hash, cookieOptions)
    .cookie('rdga_number', rdgaNumber, cookieOptions);

const clearCookies = (response: Response): Response =>
  response.clearCookie('authorization_hash').clearCookie('rdga_number');
class AuthorizationController extends BaseController<
  IAuthData,
  IAuthDataDb,
  'rdgaNumber',
  'rdga_number',
  typeof authorizationService,
  typeof authorizationDao
> {
  constructor() {
    super(
      authorizationService,
      'rdgaNumber',
      'rdga_number',
      z.any(),
      z.any(),
      'rdga_number',
    );
  }

  protected _response401(response: Response) {
    return clearCookies(response).status(401).send('Not authorized');
  }

  async login(request: Request, response: Response) {
    const result = telegramAuthorizationData.safeParse(request.body);

    if (!result.success) {
      return this._response400Schema(response, result.error);
    }

    if (!checkTgAuthorization(result.data)) {
      return this._response400(response, 'Your data is corrupted');
    }

    try {
      const authData = await authorizationService.updateAuthData(result.data);

      if (!authData) {
        return this._response404(response);
      }

      return this._response200(
        setCookie(response, result.data.hash, authData.rdgaNumber),
        { rdgaNumber: authData.rdgaNumber, avatarUrl: authData.avatarUrl },
      );
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async register(request: Request, response: Response) {
    const { rdgaNumber, ...tgAuthData } = request.body;
    if (isNaN(Number(rdgaNumber))) {
      return this._response400(
        response,
        'RDGA number is incorrect or not defined',
      );
    }

    const result = telegramAuthorizationData.safeParse(tgAuthData);
    if (!result.success) {
      return this._response400Schema(response, result.error);
    }

    if (!checkTgAuthorization(result.data)) {
      return this._response400(response, 'Your data is corrupted');
    }

    try {
      const authData = await authorizationService.createAuthData(
        Number(rdgaNumber),
        result.data,
      );

      return this._response200(
        setCookie(response, result.data.hash, authData.rdgaNumber),
        {
          rdgaNumber: authData.rdgaNumber,
          avatarUrl: authData.avatarUrl,
        },
      );
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async logout(_request: Request, response: Response) {
    return clearCookies(response).status(201).send();
  }

  async authorize(request: Request, response: Response) {
    const { rdga_number: rdgaNumber, authorization_hash: hash } =
      request.cookies;

    const numberedRdgaNumber = Number(rdgaNumber);

    if (!rdgaNumber || !hash || isNaN(numberedRdgaNumber)) {
      return this._response401(response);
    }

    try {
      const baseUserInfo = await authorizationService.checkAuthData(
        numberedRdgaNumber,
        hash,
      );

      return this._response200(response, baseUserInfo);
    } catch (_error) {
      return this._response401(response);
    }
  }
}

export default new AuthorizationController();
