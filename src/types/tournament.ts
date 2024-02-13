import TournamentType from 'enums/TournamentType';

export interface ITournament {
  code: string;
  name: string;
  town: string;
  startDate: string;
  endDate: string;
  tournamentType: TournamentType;
  metrixId: string | null;
}
