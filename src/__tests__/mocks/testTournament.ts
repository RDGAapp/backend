import TournamentType from 'enums/TournamentType';
import { addDays } from '../../helpers/dateHelper';

export default {
  code: 'test',
  name: 'Test',
  town: 'Тестово',
  startDate: addDays(new Date(), -1),
  endDate: addDays(new Date(), 10),
  tournamentType: TournamentType.AllStar,
} as Tournament;
