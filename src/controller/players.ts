import { Request, Response } from 'express';
import playerService from 'service/players';
import {
  playerSchema,
  playerPutSchema,
  playerUpdateRatingSchema,
  multipleRdgaRatingUpdateSchema,
} from 'joiSchemas';
import { response500, response400Joi } from 'helpers/responses';

class PlayerController {
  async getAll(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;
    const surname = (request.query.surname as string) || '';
    const town = (request.query.town as string) || '';
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
    const { error, value: playerToCreate } = playerSchema.validate(
      request.body,
    );

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const playerRdgaNumber = await playerService.create(playerToCreate);

      response
        .status(201)
        .send(`Игрок с номером РДГА ${playerRdgaNumber} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { rdgaNumber } = request;

    const { error, value: playerToUpdate } = playerPutSchema.validate(
      request.body,
    );

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const updatedPlayer = await playerService.update({
        rdgaNumber,
        ...playerToUpdate,
      } as Player);

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

    const { error, value } = playerUpdateRatingSchema.validate(request.body);
    if (error) {
      return response400Joi(response, error);
    }
    const { rating } = value;

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
    const { error, value } = multipleRdgaRatingUpdateSchema.validate(
      request.body,
    );
    if (error) {
      return response400Joi(response, error);
    }

    const errors: unknown[] = [];
    const updatedPlayers: Player[] = [];

    await Promise.all(
      value.map(async (updateRatingValue) => {
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
}

export default new PlayerController();
