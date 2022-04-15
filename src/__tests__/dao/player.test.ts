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
    test('should use select from table player ', async() => {
      await playerDao.getAll(1);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(playerMapping);
      expect(db().orderBy).toBeCalledTimes(1);
      expect(db().orderBy).toBeCalledWith('rdga_rating', 'desc');
      expect(db().paginate).toBeCalledTimes(1);
      expect(db().paginate).toBeCalledWith({ perPage: 15, currentPage: 1, isLengthAware: true });
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player if it was found', async() => {
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

    test('should return null if it was found', async() => {
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
    test('should return player if it was found', async() => {
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

    test('should return null if it was found', async() => {
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

  describe('createPlayer', () => {
    test('should return player RDGA number', async() => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const playerRdgaNumber = await playerDao.createPlayer(testPlayerDb);

      expect(playerRdgaNumber).toBe(1);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().insert).toBeCalledTimes(1);
      expect(db().insert).toBeCalledWith(testPlayerDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('rdga_number');
    });
  });

  describe('updatePlayer', () => {
    test('should return updated player', async() => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.updatePlayer(testPlayerDb);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().update).toBeCalledTimes(1);
      expect(db().update).toBeCalledWith(testPlayerDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('*');
    });
  });

  describe('deletePlayer', () => {
    test('should delete player', async() => {
      await playerDao.deletePlayer(1);

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('player');
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ rdga_number: 1 });
      expect(db().del).toBeCalledTimes(1);
      expect(db().del).toBeCalledWith();
    });
  });
});
