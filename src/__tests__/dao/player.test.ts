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
      await playerDao.getAll();
      expect(db.from).toBeCalledTimes(1);
      expect(db.from).toBeCalledWith('player');
      expect(db.select).toBeCalledTimes(1);
      expect(db.select).toBeCalledWith(playerMapping);
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player if it was found', async() => {
      (db.where as jest.Mock).mockReturnValueOnce([testPlayer])

      const player = await playerDao.getByRdgaNumber(24);

      expect(db.from).toBeCalledTimes(1);
      expect(db.from).toBeCalledWith('player');
      expect(db.select).toBeCalledTimes(1);
      expect(db.select).toBeCalledWith(playerMapping);
      expect(db.where).toBeCalledTimes(1);
      expect(db.where).toBeCalledWith({ rdgaNumber: 24 });
      expect(player).toEqual(testPlayer);
    });

    test('should return null if it was found', async() => {
      (db.where as jest.Mock).mockReturnValueOnce([])

      const player = await playerDao.getByRdgaNumber(24);

      expect(db.from).toBeCalledTimes(1);
      expect(db.from).toBeCalledWith('player');
      expect(db.select).toBeCalledTimes(1);
      expect(db.select).toBeCalledWith(playerMapping);
      expect(db.where).toBeCalledTimes(1);
      expect(db.where).toBeCalledWith({ rdgaNumber: 24 });
      expect(player).toEqual(null);
    });
  });

  describe('createPlayer', () => {
    test('should return player ID', async() => {
      (db.returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      const playerRdgaNumber = await playerDao.createPlayer(testPlayerDb);

      expect(playerRdgaNumber).toBe(1);
      expect(db.insert).toBeCalledTimes(1);
      expect(db.insert).toBeCalledWith(testPlayerDb);
      expect(db.into).toBeCalledTimes(1);
      expect(db.into).toBeCalledWith('player');
      expect(db.returning).toBeCalledTimes(1);
      expect(db.returning).toBeCalledWith('*');
    });
  });
});
