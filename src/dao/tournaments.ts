import db from 'database';
import tournamentMapping from 'mapping/tournament';

class TournamentDao {
  #tableName;

  constructor() {
    this.#tableName = 'tournaments';
  }

  async getAll(): Promise<Tournament[]> {
    const query = db(this.#tableName);
    const now = new Date();

    return query
      .select(tournamentMapping)
      .where('start_date', '<=', now.toISOString())
      .where('end_date', '>=', now.toISOString());
  }

  async create(tournament: TournamentDb): Promise<string> {
    const createdTournament = await db(this.#tableName)
      .insert(tournament)
      .returning('name');

    return createdTournament[0].name;
  }
}

export default new TournamentDao();
