import TournamentType from 'enums/TournamentType';

export default {
  code: 'test',
  name: 'Test',
  town: 'Тестово',
  startDate: new Date('2000-1-1'),
  endDate: new Date('3000-1-1'),
  tournamentType: TournamentType.AllStar,
  metrixId: 'testMetrixId',
} as Tournament;
