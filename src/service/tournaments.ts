import tournamentDao from 'dao/tournaments';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import tournamentMapping from 'mapping/tournament';

class PlayerService {
  // TODO: get by code and add some checks to the requests

  async getAll(): Promise<Tournament[]> {
    const tournamentsDao = await tournamentDao.getAll();

    return tournamentsDao;
  }

  async create(tournament: Tournament): Promise<string> {
    const playerDb = objectToDbObject<Tournament, TournamentDb>(
      tournament,
      tournamentMapping,
    );

    const tournamentName = await tournamentDao.create(playerDb);

    return tournamentName;
  }

  async update(tournament: Tournament): Promise<Tournament> {
    const tournamentDb = objectToDbObject<Tournament, TournamentDb>(tournament, tournamentMapping);

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
}

export default new PlayerService();