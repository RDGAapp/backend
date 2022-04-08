import playerService from 'service/player';
import playerDao from 'dao/player';
import mockPlayer from '../helpers/mockPlayer';

jest.mock('dao/player');

describe('Player Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should return whatever playerDao returns', async() => {
      (playerDao.getAll as jest.Mock).mockReturnValueOnce([]);
      const players = await playerService.getAll();
      expect(players).toEqual([]);
      expect(playerDao.getAll).toBeCalledTimes(1);
    });
  });

  describe('getById', () => {
    test('should return player', async() => {
      (playerDao.getById as jest.Mock).mockReturnValueOnce(mockPlayer);
      const player = await playerService.getById(24);
      expect(player).toEqual(mockPlayer);
      expect(playerDao.getById).toBeCalledTimes(1);
    });

    test('should return null', async() => {
      (playerDao.getById as jest.Mock).mockReturnValueOnce(null);
      const player = await playerService.getById(24);
      expect(player).toEqual(null);
      expect(playerDao.getById).toBeCalledTimes(1);
    });
  })
});
