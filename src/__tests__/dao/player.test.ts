import db from 'database';
import playerDao from 'dao/player';
import playerMapping from 'mapping/player';

jest.mock('database');

describe('Player Dao', () => {
  afterEach(() => {
    jest.resetAllMocks();
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
});
