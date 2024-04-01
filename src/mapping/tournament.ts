import { ITournament } from 'types/tournament';
import { ITournamentDb } from 'types/tournamentDb';

export default {
  code: 'code',
  name: 'name',
  town: 'town',
  startDate: 'start_date',
  endDate: 'end_date',
  tournamentType: 'tournament_type',
  metrixId: 'metrix_id',
} satisfies Record<keyof ITournament, keyof ITournamentDb>;
