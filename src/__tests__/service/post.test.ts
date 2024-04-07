import postsService from 'service/post';
import postsDao from 'dao/post';

jest.mock('dao/post');

describe('Post Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaginated', () => {
    test('should return whatever postsDao returns', async () => {
      (postsDao.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      const posts = await postsService.getAllPaginated(3);

      expect(posts).toEqual([]);
      expect(postsDao.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(postsDao.getAllPaginated).toHaveBeenCalledWith(3);
    });

    test('should pass from', async () => {
      (postsDao.getAllPaginated as jest.Mock).mockReturnValueOnce([]);

      const posts = await postsService.getAllPaginated(3, 'testDateTime');

      expect(posts).toEqual([]);
      expect(postsDao.getAllPaginated).toHaveBeenCalledTimes(1);
      expect(postsDao.getAllPaginated).toHaveBeenCalledWith(3, 'testDateTime');
    });
  });
});
