import { Request, Response } from 'express';
import playerService from 'service/player';
import playerDao from 'dao/player';
import {
  playerSchema,
  playerPutSchema,
  playerUpdateRatingSchema,
  multipleRdgaRatingUpdateSchema,
} from 'schemas';
import { IPlayerBase } from 'types/player';
import logger from 'helpers/logger';
import { getPlayerDataFromBitrix } from 'helpers/externalApiHelpers';
import BaseController, { RdgaRequest } from './base';
import { IPlayerDb } from 'types/playerDb';

class PlayerController extends BaseController<
  IPlayerBase,
  IPlayerDb,
  'rdgaNumber',
  'rdga_number',
  typeof playerService,
  typeof playerDao
> {
  constructor() {
    super(
      playerService,
      'rdgaNumber',
      'rdga_number',
      playerSchema,
      playerPutSchema,
      'rdga_number',
    );
  }

  async getAll(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;
    const surname = (request.query.surname as string) || '';
    const town = request.query.town?.toString() || '';
    const onlyActive = request.query.onlyActive === 'true' ? true : false;

    try {
      const players = await playerService.getAllPaginated(
        pageNumber,
        surname,
        town,
        onlyActive,
      );

      return this._response200(response, players);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async updateRdgaRating(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    const result = playerUpdateRatingSchema.safeParse(request.body);
    if (!result.success) {
      return this._response400Schema(response, result.error);
    }
    const { rating } = result.data;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }

      const updatedPlayer = await playerService.updateRdgaRating(
        primaryKeyValue,
        rating,
      );

      return this._response200(response, updatedPlayer);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async activatePlayerForCurrentYear(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }

      const updatedPlayer = await playerService.activatePlayerForCurrentYear(
        primaryKeyValue,
      );

      return this._response200(response, updatedPlayer);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async multipleUpdateRdgaRating(request: Request, response: Response) {
    logger.info('multipleUpdateRdgaRating request acquired');
    const result = multipleRdgaRatingUpdateSchema.safeParse(request.body);
    if (!result.success) {
      return this._response400Schema(response, result.error);
    }

    const errors: unknown[] = [];
    const updatedPlayers: IPlayerBase[] = [];

    for (const updateRatingValue of result.data) {
      try {
        const { rdgaNumber, rating } = updateRatingValue;
        const updatedPlayer = await playerService.updateRdgaRating(
          rdgaNumber,
          rating,
        );

        updatedPlayers.push(updatedPlayer);
      } catch (error) {
        errors.push(error);
      }
    }

    return this._response200(response, { updatedPlayers, errors });
  }

  async updatePlayerFromBitrix(request: Request, response: Response) {
    const rdgaNumber = Number(request.query.rdgaNumber);
    if (isNaN(rdgaNumber)) {
      return this._response500(response, new Error('Invalid rdgaNumber'));
    }

    try {
      const playerFromDb = await playerService.getByPrimaryKey(rdgaNumber);
      const playerFromBitrix = await getPlayerDataFromBitrix(rdgaNumber);

      if (!playerFromDb) {
        const newPlayerNumber = await playerService.create(playerFromBitrix);

        if (!newPlayerNumber) {
          return this._response500(
            response,
            new Error('Player was not created'),
          );
        }
      }

      const updatedPlayer = await playerService.activatePlayerForCurrentYear(
        rdgaNumber,
      );

      return this._response200(response, updatedPlayer);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async getPlayerPermissions(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }
      const playerPermissions = await this._service.getAllPermissions(
        primaryKeyValue,
      );

      return this._response200(response, playerPermissions);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async getPlayerRoles(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    try {
      if (!primaryKeyValue) {
        throw new Error('No primary key value provided');
      }
      const playerRoles = await this._service.getAllRoles(primaryKeyValue);

      return this._response200(response, playerRoles);
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async addRoleToPlayer(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    const roleCode = request.body[0];

    try {
      if (!primaryKeyValue || !roleCode) {
        throw new Error('No primary key or role code value provided');
      }

      await this._service.addRoleToPlayer(primaryKeyValue, roleCode);

      return this._response201(response, roleCode, 'added');
    } catch (error) {
      return this._response500(response, error);
    }
  }

  async removeRoleFromPlayer(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    const roleCode = request.body[0];

    try {
      if (!primaryKeyValue || !roleCode) {
        throw new Error('No primary key or role code value provided');
      }

      await this._service.removeRoleFromPlayer(primaryKeyValue, roleCode);

      return this._response201(response, roleCode, 'removed');
    } catch (error) {
      return this._response500(response, error);
    }
  }
}

export default new PlayerController();
