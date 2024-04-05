import tournamentsService from 'service/tournament';
import tournamentsDao from 'dao/tournament';

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
});
