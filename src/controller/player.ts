import { Request, Response } from 'express';
import playerService from 'service/player';
import { playerSchema, playerPutSchema } from 'joiSchemas';
import { response500, response400Joi, response400 } from 'helpers/responses';

class PlayerController {
  async getAll(request: Request, response: Response) {
    try {
      const players = await playerService.getAll();

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
    } catch(error) {
      return response500(response, error);
    }
  }

  async createPlayer(request: Request, response: Response) {
    const { error, value: playerToCreate } = playerSchema.validate(request.body);

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const playerRdgaNumber = await playerService.createPlayer(playerToCreate)

      response.status(200).send(`Игрок с номером РДГА ${playerRdgaNumber} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async updatePlayer(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    const { error, value: playerToUpdate } = playerPutSchema.validate(request.body);

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const updatedPlayer = await playerService.updatePlayer({ rdgaNumber, ...playerToUpdate } as Player);

      return response.status(200).json(updatedPlayer);
    } catch(error) {
      return response500(response, error);
    }
  }

  async deletePlayer(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'he');

    try {
      await playerService.deletePlayer(rdgaNumber);

      response.status(200).send(`Игрок с номером РДГА ${rdgaNumber} удален`);
    } catch(error) {
      return response500(response, error);
    }
  }
}

export default new PlayerController();