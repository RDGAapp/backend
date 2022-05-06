import { Request, Response } from 'express';
import playerService from 'service/player';
import { playerSchema, playerPutSchema, playerUpdateRatingSchema } from 'joiSchemas';
import { response500, response400Joi, response400 } from 'helpers/responses';

class PlayerController {
  async getAll(request: Request, response: Response) {
    const pageNumber = Number(request.query.page) || 1;
    try {
      const players = await playerService.getAll(pageNumber);

      return response.status(200).json(players);
    } catch (error) {
      return response500(response, error);
    }
  }

  async getByRdgaNumber(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    try {
      const player = await playerService.getByRdgaNumber(rdgaNumber);

      if (!player) {
        return response.status(404).send('Игрок с таким номером РДГА не найден');
      }
      return response.status(200).json(player);
    } catch (error) {
      return response500(response, error);
    }
  }

  async create(request: Request, response: Response) {
    const { error, value: playerToCreate } = playerSchema.validate(request.body);

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const playerRdgaNumber = await playerService.create(playerToCreate)

      response.status(200).send(`Игрок с номером РДГА ${playerRdgaNumber} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    const { error, value: playerToUpdate } = playerPutSchema.validate(request.body);

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const updatedPlayer = await playerService.update({ rdgaNumber, ...playerToUpdate } as Player);

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }

  async delete(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    try {
      await playerService.delete(rdgaNumber);

      return response.status(200).send(`Игрок с номером РДГА ${rdgaNumber} удален`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async updateRdgaRating(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    const { error, value } = playerUpdateRatingSchema.validate(request.body);
    if (error) {
      return response400Joi(response, error);
    }
    const { rating } = value;

    try {
      const updatedPlayer = await playerService.updateRdgaRating(rdgaNumber, rating);

      return response.status(200).json(updatedPlayer);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new PlayerController();