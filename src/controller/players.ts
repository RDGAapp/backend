import { Request, Response } from 'express';
import playerService from 'service/players';
import {
  playerSchema,
  playerPutSchema,
  playerUpdateRatingSchema,
  multipleRdgaRatingUpdateSchema,
} from 'schemas';
import { response500, response400Schema } from 'helpers/responses';
import { IPlayer, IPlayerBase } from 'types/player';
import logger from 'helpers/logger';
import { getPlayerDataFromBitrix } from 'helpers/externalApiHelpers';
class PlayerController {
  async getAll(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;
    const surname = (request.query.surname as string) || '';
    const town = request.query.town?.toString() || '';
    const onlyActive = request.query.onlyActive === 'true' ? true : false;

    try {
      const players = await playerService.getAll(
        pageNumber,
        surname,
        town,
        onlyActive,
      );

      return response.status(200).json(players);
    } catch (error) {
      return response500(response, error);
    }
  }

  async getByRdgaNumber(request: Request, response: Response) {
    const { rdgaNumber } = request;

    try {
      const player = await playerService.getByRdgaNumber(rdgaNumber);

      if (!player) {
        return response
          .status(404)
          .send('Игрок с таким номером РДГА не найден');
      }
      return response.status(200).json(player);
    } catch (error) {
      return response500(response, error);
    }
  }

  async create(request: Request, response: Response) {
    const result = playerSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const playerRdgaNumber = await playerService.create(result.data);

      response
        .status(201)
        .send(`Игрок с номером РДГА ${playerRdgaNumber} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { rdgaNumber } = request;

    const result = playerPutSchema.safeParse(request.body);

    if (!result.success) {
      return response400Schema(response, result.error);
    }

    try {
      const updatedPlayer = await playerService.update({
        rdgaNumber,
        ...result.data,
      } as IPlayer);

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }

  async delete(request: Request, response: Response) {
    const { rdgaNumber } = request;

    try {
      await playerService.delete(rdgaNumber);

      return response
        .status(200)
        .send(`Игрок с номером РДГА ${rdgaNumber} удален`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async updateRdgaRating(request: Request, response: Response) {
    const { rdgaNumber } = request;

    const result = playerUpdateRatingSchema.safeParse(request.body);
    if (!result.success) {
      return response400Schema(response, result.error);
    }
    const { rating } = result.data;

    try {
      const updatedPlayer = await playerService.updateRdgaRating(
        rdgaNumber,
        rating,
      );

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }

  async activatePlayerForCurrentYear(request: Request, response: Response) {
    const { rdgaNumber } = request;

    try {
      const updatedPlayer = await playerService.activatePlayerForCurrentYear(
        rdgaNumber,
      );

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }

  async multipleUpdateRdgaRating(request: Request, response: Response) {
    logger.info('multipleUpdateRdgaRating request acquired');
    const result = multipleRdgaRatingUpdateSchema.safeParse(request.body);
    if (!result.success) {
      return response400Schema(response, result.error);
    }

    const errors: unknown[] = [];
    const updatedPlayers: IPlayerBase[] = [];

    await Promise.all(
      result.data.map(async (updateRatingValue) => {
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
      }),
    );

    return response.status(200).json({ updatedPlayers, errors });
  }

  async updatePlayerFromBitrix(request: Request, response: Response) {
    const rdgaNumber = Number(request.query.rdgaNumber);
    if (isNaN(rdgaNumber)) {
      return response500(response, new Error('Invalid rdgaNumber'));
    }

    try {
      const playerFromDb = await playerService.getByRdgaNumber(rdgaNumber);
      const playerFromBitrix = await getPlayerDataFromBitrix(rdgaNumber);

      if (!playerFromDb) {
        logger.info('Player from bitrix to create:', playerFromBitrix);
        const newPlayerNumber = await playerService.create(playerFromBitrix);

        if (!newPlayerNumber) {
          return response500(response, new Error('Player was not created'));
        }
      }

      const updatedPlayer = await playerService.activatePlayerForCurrentYear(
        rdgaNumber,
      );

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new PlayerController();
