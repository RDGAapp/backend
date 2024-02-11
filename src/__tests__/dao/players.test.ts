import db from 'database';
import playerDao from 'dao/players';
import playerMapping from 'mapping/player';
import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';

jest.mock('database');

describe('Player Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should use select from table player ', async () => {
      await playerDao.getAll(1, 'testSurname', 'testTown', false);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(2);
      expect(db().where).toHaveBeenNthCalledWith(
        1,
        'surname',
        'ilike',
        '%testSurname%',
      );
      expect(db().where).toHaveBeenNthCalledWith(2, { town: 'testTown' });
      expect(db().orderBy).toHaveBeenCalledTimes(2);
      expect(db().orderBy).toHaveBeenNthCalledWith(1, 'rdga_rating', 'desc');
      expect(db().orderBy).toHaveBeenNthCalledWith(2, 'rdga_number', 'asc');
      expect(db().paginate).toHaveBeenCalledTimes(1);
      expect(db().paginate).toHaveBeenCalledWith({
        perPage: 30,
        currentPage: 1,
        isLengthAware: true,
      });
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([testPlayer]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(player).toEqual(testPlayer);
    });

    test('should return null if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(player).toEqual(null);
    });
  });

  describe('getByRdgaPdgaMetrixNumber', () => {
    test('should return player if it was found', async () => {
      jest.clearAllMocks();

      await playerDao.getByRdgaPdgaMetrixNumber(24, 24, 24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(db().orWhere).toHaveBeenCalledTimes(2);
      expect(db().orWhere).toHaveBeenNthCalledWith(1, { pdga_number: 24 });
      expect(db().orWhere).toHaveBeenNthCalledWith(2, { metrix_number: 24 });
    });

    test('should replace with 0 if number not stated', async () => {
      jest.clearAllMocks();

      await playerDao.getByRdgaPdgaMetrixNumber(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(db().orWhere).toHaveBeenCalledTimes(2);
      expect(db().orWhere).toHaveBeenNthCalledWith(1, { pdga_number: 0 });
      expect(db().orWhere).toHaveBeenNthCalledWith(2, { metrix_number: 0 });
    });

    test('should return null if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(player).toEqual(null);
    });
  });

  describe('create', () => {
    test('should return player RDGA number', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const playerRdgaNumber = await playerDao.create(testPlayerDb);

      expect(playerRdgaNumber).toBe(1);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().insert).toHaveBeenCalledTimes(1);
      expect(db().insert).toHaveBeenCalledWith(testPlayerDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('rdga_number');
    });
  });

  describe('update', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.update(testPlayerDb);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith(testPlayerDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete player', async () => {
      await playerDao.delete(1);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().del).toHaveBeenCalledTimes(1);
      expect(db().del).toHaveBeenCalledWith();
    });
  });

  describe('updateRdgaRating', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.updateRdgaRating(1, 1000, 200);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        rdga_rating: 1000,
        rdga_rating_change: 200,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.activatePlayerForCurrentYear(1);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('players');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        active_to: `${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });
});
