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

      this._response200(response, players);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  async updateRdgaRating(
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    response: Response,
  ) {
    const { primaryKeyValue } = request;

    const result = playerUpdateRatingSchema.safeParse(request.body);
    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
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

      this._response200(response, updatedPlayer);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
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

      this._response200(response, updatedPlayer);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }

  async multipleUpdateRdgaRating(request: Request, response: Response) {
    logger.info('multipleUpdateRdgaRating request acquired');
    const result = multipleRdgaRatingUpdateSchema.safeParse(request.body);
    if (!result.success) {
      this._response400Schema(response, result.error);
      return;
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

    this._response200(response, { updatedPlayers, errors });
    return;
  }

  async updatePlayerFromBitrix(request: Request, response: Response) {
    const rdgaNumber = Number(request.query.rdgaNumber);
    if (isNaN(rdgaNumber)) {
      this._response500(response, new Error('Invalid rdgaNumber'));
      return;
    }

    try {
      const playerFromDb = await playerService.getByPrimaryKey(rdgaNumber);
      const playerFromBitrix = await getPlayerDataFromBitrix(rdgaNumber);

      if (!playerFromDb) {
        const newPlayerNumber = await playerService.create(playerFromBitrix);

        if (!newPlayerNumber) {
          this._response500(response, new Error('Player was not created'));
          return;
        }
      }

      const updatedPlayer = await playerService.activatePlayerForCurrentYear(
        rdgaNumber,
      );

      this._response200(response, updatedPlayer);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
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

      this._response200(response, playerPermissions);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
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

      this._response200(response, playerRoles);
      return;
    } catch (error) {
      this._response500(response, error);
      return;
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

      this._response201(response, roleCode, 'added');
      return;
    } catch (error) {
      this._response500(response, error);
      return;
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

      this._response201(response, roleCode, 'removed');
      return;
    } catch (error) {
      this._response500(response, error);
      return;
    }
  }
}

export default new PlayerController();
