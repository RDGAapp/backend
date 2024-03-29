import { Tournament } from './db';

export interface ITournamentDb
  extends Omit<Tournament, 'start_date' | 'end_date'> {
  start_date: string;
  end_date: string;
}
