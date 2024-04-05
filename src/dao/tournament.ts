import db from 'database';
import tournamentMapping from 'mapping/tournament';
import { getMonday } from 'helpers/dateHelpers';
import { ITournament } from 'types/tournament';
import { ITournamentDb } from 'types/tournamentDb';
import { Table } from 'types/db';
import BaseDao from './base';

export class TournamentDao extends BaseDao<ITournament, ITournamentDb, 'code'> {
  constructor() {
    super(Table.Tournament, tournamentMapping, 'code');
  }

  async getAll(from: string, to: string): Promise<ITournament[]> {
    const query = db(this._tableName);
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
}

export default new TournamentDao();
