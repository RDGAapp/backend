import { IPlayerDb } from 'types/playerDb';

const mockPlayerDb: IPlayerDb = {
  name: 'Test',
  surname: 'User',
  rdga_number: 1,
  town: 'Somewhere',
  pdga_number: 1,
  metrix_number: 1,
  active_to: new Date(
    `${new Date().getFullYear()}-01-01T00:00:00.000Z`,
  ).toISOString(),
  sports_category: null,
};

export default mockPlayerDb;
