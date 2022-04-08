import db from 'database';
import playerDao from 'dao/player';
import playerMapping from 'mapping/player';
import mockPlayer from '../helpers/mockPlayer';

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

  describe('getById', () => {
    test('should return player if it was found', async() => {
      (db.where as jest.Mock).mockReturnValueOnce([mockPlayer])

      const player = await playerDao.getById(24);

      expect(db.from).toBeCalledTimes(1);
      expect(db.from).toBeCalledWith('player');
      expect(db.select).toBeCalledTimes(1);
      expect(db.select).toBeCalledWith(playerMapping);
      expect(db.where).toBeCalledTimes(1);
      expect(db.where).toBeCalledWith({ id: 24 });
      expect(player).toEqual(mockPlayer);
    });

    test('should return null if it was found', async() => {
      (db.where as jest.Mock).mockReturnValueOnce([])

      const player = await playerDao.getById(24);

      expect(db.from).toBeCalledTimes(1);
      expect(db.from).toBeCalledWith('player');
      expect(db.select).toBeCalledTimes(1);
      expect(db.select).toBeCalledWith(playerMapping);
      expect(db.where).toBeCalledTimes(1);
      expect(db.where).toBeCalledWith({ id: 24 });
      expect(player).toEqual(null);
    });
  });
});
