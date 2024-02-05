import TournamentType from 'enums/TournamentType';

export interface ITournament {
  code: string;
  name: string;
  town: string;
  startDate: Date;
  endDate: Date;
  tournamentType: TournamentType;
  metrixId: string | null;
}
