import db from 'database';
import postDao from 'dao/post';
import postMapping from 'mapping/post';
import { Table } from 'types/db';

jest.mock('database');

describe('Post Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaginated', () => {
    test('should use select from table post', async () => {
      await postDao.getAllPaginated(1);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Post);
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        Table.Player,
        `${Table.Post}.author_rdga_number`,
        `${Table.Player}.rdga_number`,
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        Table.AuthData,
        `${Table.Post}.author_rdga_number`,
        `${Table.AuthData}.rdga_number`,
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
      await postDao.getAllPaginated(1, 'testDateTime');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Post);
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        Table.Player,
        `${Table.Post}.author_rdga_number`,
        `${Table.Player}.rdga_number`,
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        Table.AuthData,
        `${Table.Post}.author_rdga_number`,
        `${Table.AuthData}.rdga_number`,
      );
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith(
        `${Table.Post}.created_at`,
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

  describe('getByPrimaryKey', () => {
    test('should getByCode post', async () => {
      await postDao.getByPrimaryKey('test');

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Post);
      expect(db().leftJoin).toHaveBeenCalledTimes(2);
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        1,
        Table.Player,
        `${Table.Post}.author_rdga_number`,
        `${Table.Player}.rdga_number`,
      );
      expect(db().leftJoin).toHaveBeenNthCalledWith(
        2,
        Table.AuthData,
        `${Table.Post}.author_rdga_number`,
        `${Table.AuthData}.rdga_number`,
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
