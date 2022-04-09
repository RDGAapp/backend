import { Request, Response } from 'express';
import playerService from 'service/player';
import { playerSchema } from 'joiSchemas';

class PlayerController {
  async getAll(request: Request, response: Response) {
    const players = await playerService.getAll();

    return response.status(200).json(players);
  }

  async getByRdgaNumber(request: Request, response: Response) {
    const rdgaNumber = Number(request.params.rdgaNumber);
    if (isNaN(rdgaNumber)) return response.status(400).send('Номер РДГА должен быть числом');

    const player = await playerService.getByRdgaNumber(rdgaNumber);

    if (!player) {
      return response.status(404).send('Игрок с таким номером РДГА не найден');
    }
    return response.status(200).json(player);
  }

  async createPlayer(request: Request, response: Response) {
    const { error, value: playerToCreate } = playerSchema.validate(request.body);

    if (error) {
      return response.status(400).send(`Проверьте данные: ${error.details[0].message}`);
    }

    try {
      const playerRdgaNumber = await playerService.createPlayer(playerToCreate)

      response.status(200).send(`Игрок с номером РДГА ${playerRdgaNumber} создан`);
    } catch (error) {
      return response.status(500).send(String(error))
    }
  }
}

export default new PlayerController();