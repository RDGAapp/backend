import { Request, Response } from 'express';
import tournamentsService from 'service/tournaments';
import { response400Joi, response500 } from 'helpers/responses';
import { tournamentPutSchema, tournamentSchema } from 'joiSchemas';
import { ITournament } from 'types/tournament';

class TournamentsController {
  async getAll(request: Request, response: Response) {
    const from = (request.query.from as string) || '';
    const to = (request.query.to as string) || '';

    try {
      const tournaments = await tournamentsService.getAll(from, to);

      return response.status(200).json(tournaments);
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
      } as ITournament);

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

export default new TournamentsController();
