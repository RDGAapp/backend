import db from 'database';
import tournamentDao from 'dao/tournaments';
import tournamentMapping from 'mapping/tournament';
import testTournamentDb from '__tests__/mocks/testTournamentDb';

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
      const now = new Date().toISOString();

      await tournamentDao.getAll();
      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().select).toBeCalledTimes(1);
      expect(db().select).toBeCalledWith(tournamentMapping);
      expect(db().where).toBeCalledTimes(2);
      expect(db().where).toHaveBeenNthCalledWith(1, 'start_date', '<=', now);
      expect(db().where).toHaveBeenNthCalledWith(2, 'end_date', '>=', now);
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
    test('should delete player', async () => {
      await tournamentDao.delete('test');

      expect(db).toBeCalledTimes(1);
      expect(db).toBeCalledWith('tournaments');
      expect(db().where).toBeCalledTimes(1);
      expect(db().where).toBeCalledWith({ code: 'test' });
      expect(db().del).toBeCalledTimes(1);
      expect(db().del).toBeCalledWith();
    });
  });
});
