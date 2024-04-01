import tournamentDao from 'dao/tournament';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import tournamentMapping from 'mapping/tournament';
import { ITournament } from 'types/tournament';
import { ITournamentDb } from 'types/tournamentDb';

class TournamentService {
  async getAll(from: string, to: string): Promise<ITournament[]> {
    const tournamentsDao = await tournamentDao.getAll(from, to);

    return tournamentsDao;
  }

  async create(tournament: ITournament): Promise<string> {
    const tournamentDb = objectToDbObject<ITournament, ITournamentDb>(
      tournament,
      tournamentMapping,
    );

    const tournamentName = await tournamentDao.create(tournamentDb);

    return tournamentName;
  }

  async update(tournament: ITournament): Promise<ITournament> {
    const tournamentDb = objectToDbObject<ITournament, ITournamentDb>(
      tournament,
      tournamentMapping,
    );

    const updatedTournamentDb = await tournamentDao.update(tournamentDb);

    const updatedTournament = dbObjectToObject<ITournamentDb, ITournament>(
      updatedTournamentDb,
      tournamentMapping,
    );
    return updatedTournament;
  }

  async delete(code: string): Promise<void> {
    await tournamentDao.delete(code);
  }

  async getByCode(code: string): Promise<ITournament> {
    return tournamentDao.getByCode(code);
  }
}

export default new TournamentService();
