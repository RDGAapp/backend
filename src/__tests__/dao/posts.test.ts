import db from 'database';
import postDao from 'dao/posts';
import postMapping from 'mapping/post';
import testPostDb from '__tests__/mocks/testPostDb';

jest.mock('database');

describe('Posts Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    test('should use select from table post', async () => {
      await postDao.getAll({ pageNumber: 1 });
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        'player',
        'post.author_rdga_number',
        'player.rdga_number',
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        'auth_data',
        'post.author_rdga_number',
        'auth_data.rdga_number',
      );
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...postMapping,
        authorName: 'name',
        authorSurname: 'surname',
        authorAvatarUrl: 'telegram_photo_url',
      });
      expect(db().orderBy).toHaveBeenCalledTimes(1);
      expect(db().orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(db().paginate).toHaveBeenCalledTimes(1);
      expect(db().paginate).toHaveBeenCalledWith({
        perPage: 10,
        currentPage: 1,
        isLengthAware: true,
      });
    });

    test('should use select from table post with from', async () => {
      await postDao.getAll({ pageNumber: 1, fromDateTime: 'testDateTime' });
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        'player',
        'post.author_rdga_number',
        'player.rdga_number',
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        'auth_data',
        'post.author_rdga_number',
        'auth_data.rdga_number',
      );
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith(
        'post.created_at',
        '<=',
        'testDateTime',
      );
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...postMapping,
        authorName: 'name',
        authorSurname: 'surname',
        authorAvatarUrl: 'telegram_photo_url',
      });
      expect(db().orderBy).toHaveBeenCalledTimes(1);
      expect(db().orderBy).toHaveBeenCalledWith('created_at', 'desc');
      expect(db().paginate).toHaveBeenCalledTimes(1);
      expect(db().paginate).toHaveBeenCalledWith({
        perPage: 10,
        currentPage: 1,
        isLengthAware: true,
      });
    });
  });

  describe('create', () => {
    test('should return test post name ', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPostDb]);
      jest.clearAllMocks();

      const testPostName = await postDao.create(testPostDb);

      expect(testPostName).toBe(testPostDb.header);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().insert).toHaveBeenCalledTimes(1);
      expect(db().insert).toHaveBeenCalledWith(testPostDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('header');
    });
  });

  describe('update', () => {
    test('should return updated post', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPostDb]);
      jest.clearAllMocks();

      const updatedPost = await postDao.update(testPostDb);

      expect(updatedPost).toEqual(testPostDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith(testPostDb);
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete post', async () => {
      await postDao.delete('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ code: 'test' });
      expect(db().del).toHaveBeenCalledTimes(1);
      expect(db().del).toHaveBeenCalledWith();
    });
  });

  describe('getByCode', () => {
    test('should getByCode post', async () => {
      await postDao.getByCode('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('post');
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        'player',
        'post.author_rdga_number',
        'player.rdga_number',
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        'auth_data',
        'post.author_rdga_number',
        'auth_data.rdga_number',
      );
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...postMapping,
        authorName: 'name',
        authorSurname: 'surname',
        authorAvatarUrl: 'telegram_photo_url',
      });
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ code: 'test' });
    });
  });
});
