import { Response } from 'express';
import tournamentService from 'service/tournament';
import tournamentDao from 'dao/tournament';
import { tournamentPutSchema, tournamentSchema } from 'schemas';
import { ITournament } from 'types/tournament';
import { ITournamentDb } from 'types/tournamentDb';
import BaseController, { RdgaRequest } from './base';

class TournamentController extends BaseController<
  ITournament,
  ITournamentDb,
  'code',
  'code',
  typeof tournamentService,
  typeof tournamentDao
> {
  constructor() {
    super(
      tournamentService,
      'code',
      'code',
      tournamentSchema,
      tournamentPutSchema,
      'name',
    );
  }

  async getAll(
    request: RdgaRequest<ITournamentDb, 'code'>,
    response: Response,
  ) {
    const from = (request.query.from as string) || '';
    const to = (request.query.to as string) || '';

    const tournaments = await tournamentService.getAll(from, to);

    return this._response200(response, tournaments);
  }
}

export default new TournamentController();
