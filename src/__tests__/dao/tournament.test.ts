import db from 'database';
import tournamentDao from 'dao/tournament';
import tournamentMapping from 'mapping/tournament';
import { getMonday } from '../../helpers/dateHelpers';
import { Table } from 'types/db';

jest.mock('database');

describe('Tournament Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('should use select from table tournaments ', async () => {
      const now = new Date();
      const monday = getMonday(now);

      await tournamentDao.getAll('', '');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Tournament);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(tournamentMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith(
        'end_date',
        '>=',
        monday.toISOString(),
      );
    });

    test('should use select from table tournaments with from', async () => {
      await tournamentDao.getAll('a', '');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Tournament);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(tournamentMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith('start_date', '>=', 'a');
    });

    test('should use select from table tournaments with to', async () => {
      await tournamentDao.getAll('', 'b');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Tournament);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(tournamentMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith('end_date', '<=', 'b');
    });

    test('should use select from table tournaments with from and to', async () => {
      await tournamentDao.getAll('a', 'b');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Tournament);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(tournamentMapping);
      expect(db().where).toHaveBeenCalledTimes(2);
      expect(db().where).toHaveBeenCalledWith('start_date', '>=', 'a');
      expect(db().where).toHaveBeenCalledWith('end_date', '<=', 'b');
    });
  });
});
