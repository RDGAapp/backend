import tournamentDao from 'dao/tournaments';
import objectToDbObject from 'helpers/objectToDbObject';
import tournamentMapping from 'mapping/tournament';

class PlayerService {
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
}

export default new PlayerService();
