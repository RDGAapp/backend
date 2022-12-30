import TournamentType from 'enums/TournamentType';
import { addDays } from 'helpers/dateHelper';

export default {
  code: 'test',
  name: 'Test',
  town: 'Тестово',
  start_date: addDays(new Date(), -1),
  end_date: addDays(new Date(), 10),
  tournament_type: TournamentType.AllStar,
} as TournamentDb;
