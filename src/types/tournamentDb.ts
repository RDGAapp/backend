import TournamentType from 'enums/TournamentType';

export interface ITournamentDb {
  code: string;
  name: string;
  town: string;
  start_date: string;
  end_date: string;
  tournament_type: TournamentType;
  metrix_id: string | null;
}
