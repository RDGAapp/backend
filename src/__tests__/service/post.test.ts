import postsService from 'service/post';
import postsDao from 'dao/post';
import testPost from '__tests__/mocks/testPost';
import testPostDb from '__tests__/mocks/testPostDb';

jest.mock('dao/post');

describe('Post Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('getAll', () => {
    test('should return whatever postsDao returns', async () => {
      (postsDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const posts = await postsService.getAll({ pageNumber: 3 });

      expect(posts).toEqual([]);
      expect(postsDao.getAll).toHaveBeenCalledTimes(1);
      expect(postsDao.getAll).toHaveBeenCalledWith({ pageNumber: 3 });
    });

    test('should pass from', async () => {
      (postsDao.getAll as jest.Mock).mockReturnValueOnce([]);

      const posts = await postsService.getAll({
        pageNumber: 3,
        fromDateTime: 'testDateTime',
      });

      expect(posts).toEqual([]);
      expect(postsDao.getAll).toHaveBeenCalledTimes(1);
      expect(postsDao.getAll).toHaveBeenCalledWith({
        pageNumber: 3,
        fromDateTime: 'testDateTime',
      });
    });
  });

  describe('create', () => {
    test('should return header', async () => {
      (postsDao.create as jest.Mock).mockReturnValueOnce('Test');

      const testPostToCreate = testPost;
      const testPostDbToCreate = testPostDb;

      const tournamentName = await postsService.create(testPostToCreate);

      expect(tournamentName).toBe('Test');
      expect(postsDao.create).toHaveBeenCalledTimes(1);
      expect(postsDao.create).toHaveBeenCalledWith(testPostDbToCreate);
    });
  });

  describe('update', () => {
    test('should return updated post', async () => {
      (postsDao.update as jest.Mock).mockReturnValueOnce(testPostDb);

      const updatedPost = await postsService.update(testPost);

      expect(updatedPost).toEqual(testPost);
      expect(postsDao.update).toHaveBeenCalledTimes(1);
      expect(postsDao.update).toHaveBeenCalledWith(testPostDb);
    });
  });

  describe('delete', () => {
    test('should call dao delete post', async () => {
      await postsService.delete('test');

      expect(postsDao.delete).toHaveBeenCalledTimes(1);
      expect(postsDao.delete).toHaveBeenCalledWith('test');
    });
  });

  describe('getByCode', () => {
    test('should call dao getByCode post', async () => {
      await postsService.getByCode('test');

      expect(postsDao.getByCode).toHaveBeenCalledTimes(1);
      expect(postsDao.getByCode).toHaveBeenCalledWith('test');
    });
  });
});
