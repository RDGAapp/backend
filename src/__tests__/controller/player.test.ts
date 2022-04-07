import playerController from 'controller/player';
import playerDao from 'dao/player';

describe('Player Controller', () => {
  describe('getAll', () => {
    const getAllMock = jest.fn();
    playerDao.getAll = getAllMock;
    test('should return empty array', async() => {
      getAllMock.mockReturnValueOnce([]);
      const players = await playerController.getAll();
      expect(players).toEqual([]);
      expect(getAllMock).toBeCalledTimes(1);
    });
  });
});
