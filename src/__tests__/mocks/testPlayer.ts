import { IPlayerBase } from 'types/player';

const testPlayer: IPlayerBase = {
  name: 'Test',
  surname: 'User',
  rdgaNumber: 1,
  town: 'Somewhere',
  pdgaNumber: 1,
  metrixNumber: 1,
  activeTo: new Date(
    `${new Date().getFullYear()}-01-01T00:00:00.000Z`,
  ).toISOString(),
  sportsCategory: null,
};

export default testPlayer;
