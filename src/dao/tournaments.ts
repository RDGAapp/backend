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

  async update(tournament: TournamentDb): Promise<TournamentDb> {
    const updatedTournament = await db(this.#tableName)
      .where({ code: tournament.code })
      .update(tournament)
      .returning('*');

    return updatedTournament[0];
  }

  async delete(code: string): Promise<void> {
    await db(this.#tableName).where({ code }).del();
  }
}

export default new TournamentDao();
