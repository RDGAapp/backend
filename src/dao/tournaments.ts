import db from 'database';
import tournamentMapping from 'mapping/tournament';
import { getMonday } from 'helpers/dateHelpers';

class TournamentDao {
  #tableName;

  constructor() {
    this.#tableName = 'tournaments';
  }

  async getAll(from: string, to: string): Promise<Tournament[]> {
    const query = db(this.#tableName);
    const now = new Date();
    const monday = getMonday(now);

    let results = query.select(tournamentMapping);
    if (from || to) {
      if (from) {
        results = results.where('start_date', '>=', from);
      }
      if (to) {
        results = results.where('end_date', '<=', to);
      }

      return results;
    }

    return results.where('end_date', '>=', monday.toISOString());
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

  async getByCode(code: string): Promise<Tournament> {
    const tournament = await db(this.#tableName)
      .select(tournamentMapping)
      .where({ code });

    return tournament[0];
  }
}

export default new TournamentDao();
