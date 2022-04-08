import { Request, Response } from 'express';
import playerService from 'service/player';

class PlayerController {
  async getAll(request: Request, response: Response) {
    const players = await playerService.getAll();

    response.status(200).json(players);
  }
}

export default new PlayerController();