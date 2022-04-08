import { Request, Response } from 'express';
import playerService from 'service/player';

class PlayerController {
  async getAll(request: Request, response: Response) {
    const players = await playerService.getAll();

    return response.status(200).json(players);
  }

  async getById(request: Request, response: Response) {
    const id = Number(request.params.id);
    if (isNaN(id)) return response.status(400).send('ID должен быть числом');

    const player = await playerService.getById(id);

    if (!player) {
      return response.status(404).send('Игрок с таким ID не найден');
    }
    return response.status(200).json(player);
  }
}

export default new PlayerController();