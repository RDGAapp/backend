import { IPlayer } from 'types/player';

const testPlayer: IPlayer = {
  name: 'Test',
  surname: 'User',
  rdgaNumber: 1,
  rdgaRating: 10000,
  rdgaRatingChange: 10,
  town: 'Somewhere',
  email: 'test@user.com',
  pdgaNumber: 1,
  metrixNumber: 1,
  priority: 0,
  activeTo: new Date(
    `${new Date().getFullYear()}-04-01T00:00:00.000Z`,
  ).toISOString(),
};

export default testPlayer;
