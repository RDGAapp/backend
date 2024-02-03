import { TournamentType } from './tournamentType';

export interface ITournament {
  code: string;
  name: string;
  town: string;
  startDate: Date;
  endDate: Date;
  tournamentType: TournamentType;
  metrixId: string | null;
}
