import tournamentDao from 'dao/tournaments';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import tournamentMapping from 'mapping/tournament';

class TournamentsService {
  async getAll(from: string, to: string): Promise<Tournament[]> {
    const tournamentsDao = await tournamentDao.getAll(from, to);

    return tournamentsDao;
  }

  async create(tournament: Tournament): Promise<string> {
    const tournamentDb = objectToDbObject<Tournament, TournamentDb>(
      tournament,
      tournamentMapping,
    );

    const tournamentName = await tournamentDao.create(tournamentDb);

    return tournamentName;
  }

  async update(tournament: Tournament): Promise<Tournament> {
    const tournamentDb = objectToDbObject<Tournament, TournamentDb>(
      tournament,
      tournamentMapping,
    );

    const updatedTournamentDb = await tournamentDao.update(tournamentDb);

    const updatedTournament = dbObjectToObject<TournamentDb, Tournament>(
      updatedTournamentDb,
      tournamentMapping,
    );
    return updatedTournament;
  }

  async delete(code: string): Promise<void> {
    await tournamentDao.delete(code);
  }

  async getByCode(code: string): Promise<Tournament> {
    return tournamentDao.getByCode(code);
  }
}

export default new TournamentsService();
