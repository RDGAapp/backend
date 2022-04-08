import playerService from 'service/player';
import playerDao from 'dao/player';

describe('Player Service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    const getAllMock = jest.fn();
    playerDao.getAll = getAllMock;
    test('should return whatever playerDao returns', async() => {
      getAllMock.mockReturnValueOnce([]);
      const players = await playerService.getAll();
      expect(players).toEqual([]);
      expect(getAllMock).toBeCalledTimes(1);
    });
  });
});
