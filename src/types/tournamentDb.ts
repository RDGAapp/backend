import { TournamentType } from './tournamentType';

export interface ITournamentDb {
  code: string;
  name: string;
  town: string;
  start_date: Date;
  end_date: Date;
  tournament_type: TournamentType;
  metrix_id: string | null;
}
