import { ITournamentDb } from './tournamentDb';

export interface ITournament {
  code: ITournamentDb['code'];
  name: ITournamentDb['name'];
  town: ITournamentDb['town'];
  startDate: ITournamentDb['start_date'];
  endDate: ITournamentDb['end_date'];
  tournamentType: ITournamentDb['tournament_type'];
  metrixId: ITournamentDb['metrix_id'];
}
