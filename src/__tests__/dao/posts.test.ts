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
    test('should use select from table posts', async () => {
      await postDao.getAll();
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('posts');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(postMapping);
    });
  });

  describe('create', () => {
    test('should return test post name ', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPostDb]);
      jest.clearAllMocks();

      const testPostName = await postDao.create(testPostDb);

      expect(testPostName).toBe(testPostDb.header);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('posts');
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
      expect(db).toHaveBeenCalledWith('posts');
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
      expect(db).toHaveBeenCalledWith('posts');
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
      expect(db).toHaveBeenCalledWith('posts');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(postMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ code: 'test' });
    });
  });
});
