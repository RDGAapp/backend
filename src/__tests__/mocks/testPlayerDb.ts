import { IPlayerDb } from 'types/playerDb';

const mockPlayerDb: IPlayerDb = {
  name: 'Test',
  surname: 'User',
  rdga_number: 1,
  rdga_rating: 10000,
  rdga_rating_change: 10,
  town: 'Somewhere',
  email: 'test@user.com',
  pdga_number: 1,
  pdga_rating: 10000,
  metrix_number: 1,
  priority: 0,
  active_to: new Date(`${new Date().getFullYear()}-04-01T00:00:00.000Z`),
};

export default mockPlayerDb;
