import db from 'database';
import playerRoleDao from 'dao/playerRole';
import playerRoleMapping from 'mapping/playerRole';
import { Table } from 'types/db';

jest.mock('database');

describe('PlayerRole Dao', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllByPlayer', () => {
    test('should use select from table player_role + where', async () => {
      await playerRoleDao.getAllByPlayer(1);
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.PlayerRoles);
      expect(db().select).toHaveBeenCalledTimes(1);
      expect(db().select).toHaveBeenCalledWith({
        ...playerRoleMapping,
      });
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({
        player_rdga_number: 1,
      });
    });
  });

  describe('removeRoleFromPlayer', () => {
    test('should use where from table player_role + delete', async () => {
      await playerRoleDao.removeRoleFromPlayer(1, 'su');
      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith(Table.PlayerRoles);
      expect(db().where).toHaveBeenCalledTimes(1);
      expect(db().where).toHaveBeenCalledWith({
        player_rdga_number: 1,
        role_code: 'su'
      });
      expect(db().del).toHaveBeenCalledTimes(1);
    });
  });
});
