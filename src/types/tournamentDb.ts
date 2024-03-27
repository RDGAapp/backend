import TournamentType from 'enums/TournamentType';
import { Tournaments } from './db';

export interface ITournamentDb
  extends Omit<Tournaments, 'start_date' | 'end_date'> {
  start_date: string;
  end_date: string;
  tournament_type: TournamentType;
}
