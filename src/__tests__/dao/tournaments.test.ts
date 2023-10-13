import db from 'database';
import tournamentDao from 'dao/tournaments';
import tournamentMapping from 'mapping/tournament';
import testTournamentDb from '__tests__/mocks/testTournamentDb';
import { getMonday } from '../../helpers/dateHelpers';

jest.mock('database');

describe('Tournaments Dao', () => {
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
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith(
        'end_date',
        '>=',
        monday.toISOString(),
      );
    });

    test('should use select from table tournaments with from', async () => {
      await tournamentDao.getAll('a', '');
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith('start_date', '>=', 'a');
    });

    test('should use select from table tournaments with to', async () => {
      await tournamentDao.getAll('', 'b');
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith('end_date', '<=', 'b');
    });

    test('should use select from table tournaments with from and to', async () => {
      await tournamentDao.getAll('a', 'b');
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(2);
      expect(db().where).toHaveBeenCalledWith('start_date', '>=', 'a');
      expect(db().where).toHaveBeenCalledWith('end_date', '<=', 'b');
    });
  });

  describe('create', () => {
    test('should return test tournament name ', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testTournamentDb]);
      jest.clearAllMocks();

      const testTournamentName = await tournamentDao.create(testTournamentDb);

      expect(testTournamentName).toBe(testTournamentDb.name);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().insert).toBeCalledTimes(1);
      expect(db().insert).toBeCalledWith(testTournamentDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('name');
    });
  });

  describe('update', () => {
    test('should return updated tournament', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testTournamentDb]);
      jest.clearAllMocks();

      const updatedTournament = await tournamentDao.update(testTournamentDb);

      expect(updatedTournament).toEqual(testTournamentDb);
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().update).toBeCalledTimes(1);
      expect(db().update).toBeCalledWith(testTournamentDb);
      expect(db().returning).toBeCalledTimes(1);
      expect(db().returning).toBeCalledWith('*');
    });
  });

  describe('delete', () => {
    test('should delete tournament', async () => {
      await tournamentDao.delete('test');

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ code: 'test' });
      expect(db().del).toBeCalledTimes(1);
      expect(db().del).toBeCalledWith();
    });
  });

  describe('getByCode', () => {
    test('should getByCode tournament', async () => {
      await tournamentDao.getByCode('test');

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ code: 'test' });
    });
  });
});
