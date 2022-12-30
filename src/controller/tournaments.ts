import { Request, Response } from 'express';
import tournamentsService from 'service/tournaments';
import { response400Joi, response500 } from 'helpers/responses';
import { tournamentSchema } from 'joiSchemas';

class PlayerController {
  async getAll(request: Request, response: Response) {
    try {
      const players = await tournamentsService.getAll();

      return response.status(200).json(players);
    } catch (error) {
      return response500(response, error);
    }
  }

  async create(request: Request, response: Response) {
    const { error, value: tournamentToCreate } = tournamentSchema.validate(
      request.body,
    );

    if (error) {
      return response400Joi(response, error);
    }

    try {
      const tournamentName = await tournamentsService.create(tournamentToCreate);

      response
        .status(201)
        .send(`Турнир ${tournamentName} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new PlayerController();
