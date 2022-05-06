import db from 'database';
import playerDao from 'dao/player';
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
      await playerDao.getAll(1);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().orderBy).toBeCalledTimes(2);
      expect(db().orderBy).toHaveBeenNthCalledWith(1, 'rdga_rating', 'desc');
      expect(db().orderBy).toHaveBeenNthCalledWith(2, 'rdga_number', 'asc');
      expect(db().paginate).toBeCalledTimes(1);
      expect(db().paginate).toBeCalledWith({ perPage: 15, currentPage: 1, isLengthAware: true });
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([testPlayer]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 24 });
      expect(player).toEqual(testPlayer);
    });

    test('should return null if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 24 });
      expect(player).toEqual(null);
    });
  });

  describe('getByRdgaPdgaMetrixNumber', () => {
    test('should return player if it was found', async () => {
      jest.clearAllMocks();

      await playerDao.getByRdgaPdgaMetrixNumber(24, 24, 24);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 24 });
      expect(db().orWhere).toBeCalledTimes(2);
      expect(db().orWhere).toHaveBeenNthCalledWith(1, { pdga_number: 24 });
      expect(db().orWhere).toHaveBeenNthCalledWith(2, { metrix_number: 24 });
    });

    test('should return null if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([]);
      jest.clearAllMocks();

      const player = await playerDao.getByRdgaNumber(24);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 24 });
      expect(player).toEqual(null);
    });
  });

  describe('create', () => {
    test('should return player RDGA number', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const playerRdgaNumber = await playerDao.create(testPlayerDb);

      expect(playerRdgaNumber).toBe(1);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().insert).toBeCalledTimes(1);
      expect(db().insert).toBeCalledWith(testPlayerDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('rdga_number');
    });
  });

  describe('update', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.update(testPlayerDb);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().update).toBeCalledTimes(1);
      expect(db().update).toBeCalledWith(testPlayerDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete player', async () => {
      await playerDao.delete(1);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 1 });
      expect(db().del).toBeCalledTimes(1);
      expect(db().del).toBeCalledWith();
    });
  });

  describe('updateRdgaRating', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.updateRdgaRating(1, 1000, 200);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 1 });
      expect(db().update).toBeCalledTimes(1);
      expect(db().update).toBeCalledWith({ rdga_rating: 1000, rdga_rating_change: 200 });
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('*');
    });
  });
});
