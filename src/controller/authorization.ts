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
    clearCookies(response).status(401).send('Not authorized');
    return;
  }

  async login(request: Request, response: Response) {
    const result = telegramAuthorizationData.safeParse(request.body);

    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
    }

    if (!checkTgAuthorization(result.data)) {
      this._response400(response, 'Your data is corrupted');
      return;
    }

    try {
      const authData = await authorizationService.updateAuthData(result.data);

      if (!authData) {
        this._response404(response);
        return;
      }

      this._response200(
        setCookie(response, result.data.hash, authData.rdgaNumber),
        { rdgaNumber: authData.rdgaNumber, avatarUrl: authData.avatarUrl },
      );
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  async register(request: Request, response: Response) {
    const { rdgaNumber, ...tgAuthData } = request.body;
    if (isNaN(Number(rdgaNumber))) {
      this._response400(response, 'RDGA number is incorrect or not defined');
      return;
    }

    const result = telegramAuthorizationData.safeParse(tgAuthData);
    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
    }

    if (!checkTgAuthorization(result.data)) {
      this._response400(response, 'Your data is corrupted');
      return;
    }

    try {
      const authData = await authorizationService.createAuthData(
        Number(rdgaNumber),
        result.data,
      );

      this._response200(
        setCookie(response, result.data.hash, authData.rdgaNumber),
        {
          rdgaNumber: authData.rdgaNumber,
          avatarUrl: authData.avatarUrl,
        },
      );
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  async logout(_request: Request, response: Response) {
    clearCookies(response).status(201).send();
    return;
  }

  async authorize(request: Request, response: Response) {
    const { rdga_number: rdgaNumber, authorization_hash: hash } =
      request.cookies;

    const numberedRdgaNumber = Number(rdgaNumber);

    if (!rdgaNumber || !hash || isNaN(numberedRdgaNumber)) {
      this._response401(response);
      return;
    }

    try {
      const baseUserInfo = await authorizationService.checkAuthData(
        numberedRdgaNumber,
        hash,
      );

      this._response200(response, baseUserInfo);
      return;
    } catch (_error) {
      this._response401(response);
      return;
    }
  }
}

export default new AuthorizationController();
