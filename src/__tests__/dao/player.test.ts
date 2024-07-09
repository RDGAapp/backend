import { describe, expect, test, afterEach, jest } from 'bun:test';

import db from 'database';
import playerDao from 'dao/player';
import playerMapping from 'mapping/player';
import testPlayer from '../mocks/testPlayer';
import testPlayerDb from '../mocks/testPlayerDb';
import { Table } from 'types/db';
import { mockDatabase } from '__tests__/mocks/modules';

mockDatabase();

describe('Player Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPaginated', () => {
    test('should use select from table player ', async () => {
      await playerDao.getAllPaginated(1, 'testSurname', 'testTown', false);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Player);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...playerMapping,
        rdgaNumber: `${Table.Player}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      });
      expect(db().where).toHaveBeenCalledTimes(2);
      expect(db().where).toHaveBeenNthCalledWith(
        1,
        'surname',
        'ilike',
        '%testSurname%',
      );
      expect(db().where).toHaveBeenNthCalledWith(2, { town: 'testTown' });
      expect(db().orderBy).toHaveBeenCalledTimes(2);
      expect(db().orderBy).toHaveBeenNthCalledWith(1, 'rdga_rating', 'desc');
      expect(db().orderBy).toHaveBeenNthCalledWith(
        2,
        `${Table.Player}.rdga_number`,
        'asc',
      );
      expect(db().paginate).toHaveBeenCalledTimes(1);
      expect(db().paginate).toHaveBeenCalledWith({
        perPage: 30,
        currentPage: 1,
        isLengthAware: true,
      });
    });
  });

  describe('getByRdgaNumber', () => {
    test('should return player if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([testPlayer]);
      jest.clearAllMocks();

      const player = await playerDao.getByPrimaryKey(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('player');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...playerMapping,
        rdgaNumber: `${Table.Player}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      });
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({
        [`${Table.Player}.rdga_number`]: 24,
      });
      expect(player).toEqual(testPlayer as typeof player);
    });

    test('should return null if it was found', async () => {
      (db().where as jest.Mock).mockReturnValueOnce([]);
      jest.clearAllMocks();

      const player = await playerDao.getByPrimaryKey(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith('player');
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...playerMapping,
        rdgaNumber: `${Table.Player}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      });
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({
        [`${Table.Player}.rdga_number`]: 24,
      });
      expect(player).toEqual(undefined as unknown as typeof player);
    });
  });

  describe('getByRdgaPdgaMetrixNumber', () => {
    test('should return player if it was found', async () => {
      jest.clearAllMocks();

      await playerDao.getByRdgaPdgaMetrixNumber(24, 24, 24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Player);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(db().orWhere).toHaveBeenCalledTimes(2);
      expect(db().orWhere).toHaveBeenNthCalledWith(1, { pdga_number: 24 });
      expect(db().orWhere).toHaveBeenNthCalledWith(2, { metrix_number: 24 });
    });

    test('should replace with 0 if number not stated', async () => {
      jest.clearAllMocks();

      await playerDao.getByRdgaPdgaMetrixNumber(24);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Player);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith(playerMapping);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 24 });
      expect(db().orWhere).toHaveBeenCalledTimes(2);
      expect(db().orWhere).toHaveBeenNthCalledWith(1, { pdga_number: 0 });
      expect(db().orWhere).toHaveBeenNthCalledWith(2, { metrix_number: 0 });
    });
  });

  describe('updateRdgaRating', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.updateRdgaRating(1, 1000, 200);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Player);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        rdga_rating: 1000,
        rdga_rating_change: 200,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });

  describe('activatePlayerForCurrentYear', () => {
    test('should return updated player', async () => {
      (db().returning as jest.Mock).mockReturnValueOnce([testPlayerDb]);
      jest.clearAllMocks();

      const updatedPlayer = await playerDao.activatePlayerForCurrentYear(1);

      expect(updatedPlayer).toEqual(testPlayerDb);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.Player);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({ rdga_number: 1 });
      expect(db().update).toHaveBeenCalledTimes(1);
      expect(db().update).toHaveBeenCalledWith({
        active_to: `${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`,
      });
      expect(db().returning).toHaveBeenCalledTimes(1);
      expect(db().returning).toHaveBeenCalledWith('*');
    });
  });
});
