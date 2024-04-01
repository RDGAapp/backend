import tournamentsService from 'service/tournament';
import tournamentsDao from 'dao/tournament';
import testTournament from '__tests__/mocks/testTournament';
import testTournamentDb from '__tests__/mocks/testTournamentDb';

jest.mock('dao/tournament');

describe('Tournament Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever tournamentDao returns', async () => {
      (tournamentsDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const tournaments = await tournamentsService.getAll('', '');

      expect(tournaments).toEqual([]);
      expect(tournamentsDao.getAll).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.getAll).toHaveBeenCalledWith('', '');
    });

    test('should pass from and to', async () => {
      (tournamentsDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const tournaments = await tournamentsService.getAll('a', 'b');

      expect(tournaments).toEqual([]);
      expect(tournamentsDao.getAll).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.getAll).toHaveBeenCalledWith('a', 'b');
    });
  });

  describe('create', () => {
    test('should return name', async () => {
      (tournamentsDao.create as jest.Mock).mockReturnValueOnce('Test');

      const testTournamentToCreate = testTournament;
      const testTournamentDbToCreate = testTournamentDb;

      const tournamentName = await tournamentsService.create(
        testTournamentToCreate,
      );

      expect(tournamentName).toBe('Test');
      expect(tournamentsDao.create).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.create).toHaveBeenCalledWith(
        testTournamentDbToCreate,
      );
    });
  });

  describe('update', () => {
    test('should return updated tournament', async () => {
      (tournamentsDao.update as jest.Mock).mockReturnValueOnce(
        testTournamentDb,
      );

      const updatedTournament = await tournamentsService.update(testTournament);

      expect(updatedTournament).toEqual(testTournament);
      expect(tournamentsDao.update).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.update).toHaveBeenCalledWith(testTournamentDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete tournament', async () => {
      await tournamentsService.delete('test');

      expect(tournamentsDao.delete).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.delete).toHaveBeenCalledWith('test');
    });
  });

  describe('getByCode', () => {
    test('should call dao getByCode tournament', async () => {
      await tournamentsService.getByCode('test');

      expect(tournamentsDao.getByCode).toHaveBeenCalledTimes(1);
      expect(tournamentsDao.getByCode).toHaveBeenCalledWith('test');
    });
  });
});
