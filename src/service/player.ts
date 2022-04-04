import { Request, Response } from 'express';
import playerController from 'controller/player';

class PlayerService {
  async getAll(request: Request, response: Response) {
    const players = await playerController.getAll();

    response.status(200).json(players);
  }
}

export default new PlayerService();
