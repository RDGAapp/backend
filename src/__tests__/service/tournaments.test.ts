import tournamentsService from 'service/tournaments';
import tournamentsDao from 'dao/tournaments';
import testTournament from '__tests__/mocks/testTournament';
import testTournamentDb from '__tests__/mocks/testTournamentDb';

jest.mock('dao/tournaments');

describe('Tournaments Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever playerDao returns', async () => {
      (tournamentsDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const tournaments = await tournamentsService.getAll();

      expect(tournaments).toEqual([]);
      expect(tournamentsDao.getAll).toBeCalledTimes(1);
      expect(tournamentsDao.getAll).toBeCalledWith();
    });
  });

  describe('create', () => {
    test('should return name', async () => {
      (tournamentsDao.create as jest.Mock).mockReturnValueOnce('Test');

      const tournamentName = await tournamentsService.create(testTournament);

      expect(tournamentName).toBe('Test');
      expect(tournamentsDao.create).toBeCalledTimes(1);
      expect(tournamentsDao.create).toBeCalledWith(testTournamentDb);
    });
  });
});
