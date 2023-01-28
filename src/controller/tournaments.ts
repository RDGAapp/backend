import { Request, Response } from 'express';
import tournamentsService from 'service/tournaments';
import { response400Joi, response500 } from 'helpers/responses';
import { tournamentPutSchema, tournamentSchema } from 'joiSchemas';

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
      const tournamentName = await tournamentsService.create(
        tournamentToCreate,
      );

      response.status(201).send(`Турнир ${tournamentName} создан`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async update(request: Request, response: Response) {
    const { tournamentCode } = request;

    const { error, value: tournamentToUpdate } = tournamentPutSchema.validate(
      request.body,
    );

    console.log(error);
    if (error) {
      return response400Joi(response, error);
    }

    try {
      const updatedTournament = await tournamentsService.update({
        code: tournamentCode,
        ...tournamentToUpdate,
      } as Tournament);

      return response.status(200).json(updatedTournament);
    } catch (error) {
      return response500(response, error);
    }
  }

  async delete(request: Request, response: Response) {
    const { tournamentCode } = request;

    try {
      await tournamentsService.delete(tournamentCode);

      return response.status(200).send(`Турнир ${tournamentCode} удален`);
    } catch (error) {
      return response500(response, error);
    }
  }

  async getByCode(request: Request, response: Response) {
    const { tournamentCode } = request;

    try {
      const tournament = await tournamentsService.getByCode(tournamentCode);

      return response.status(200).json(tournament);
    } catch (error) {
      return response500(response, error);
    }
  }
}

export default new PlayerController();
