import TournamentType from 'enums/TournamentType';

export default {
  code: 'test',
  name: 'Test',
  town: 'Тестово',
  start_date: new Date('2000-1-1'),
  end_date: new Date('3000-1-1'),
  tournament_type: TournamentType.AllStar,
} as TournamentDb;
