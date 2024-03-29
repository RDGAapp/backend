import { TournamentType } from 'types/db';
import { ITournament } from 'types/tournament';

export default {
  code: 'test',
  name: 'Test',
  town: 'Тестово',
  startDate: new Date('2000-1-1').toISOString(),
  endDate: new Date('3000-1-1').toISOString(),
  tournamentType: TournamentType.AllStar,
  metrixId: 'testMetrixId',
} as ITournament;
