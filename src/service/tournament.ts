import tournamentDao from 'dao/tournament';
import tournamentMapping from 'mapping/tournament';
import { ITournament } from 'types/tournament';
import { ITournamentDb } from 'types/tournamentDb';
import BaseService from './base';

class TournamentService extends BaseService<
  ITournament,
  ITournamentDb,
  typeof tournamentDao
> {
  constructor() {
    super(tournamentDao, tournamentMapping);
  }
}

export default new TournamentService();
