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

      const testTournamentToCreate = testTournament;
      const testTournamentDbToCreate = testTournamentDb;

      const tournamentName = await tournamentsService.create(testTournamentToCreate);

      expect(tournamentName).toBe('Test');
      expect(tournamentsDao.create).toBeCalledTimes(1);
      expect(tournamentsDao.create).toBeCalledWith(testTournamentDbToCreate);
    });
  });

  describe('update', () => {
    test('should return updated player', async () => {
      (tournamentsDao.update as jest.Mock).mockReturnValueOnce(testTournamentDb);

      const updatedPlayer = await tournamentsService.update(testTournament);

      expect(updatedPlayer).toEqual(testTournament);
      expect(tournamentsDao.update).toBeCalledTimes(1);
      expect(tournamentsDao.update).toBeCalledWith(testTournamentDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete player', async () => {
      await tournamentsService.delete('test');

      expect(tournamentsDao.delete).toBeCalledTimes(1);
      expect(tournamentsDao.delete).toBeCalledWith('test');
    });
  });
});