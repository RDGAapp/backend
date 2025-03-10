import { IPlayerBase } from 'types/player';
import { IPlayerDb } from 'types/playerDb';

export default {
  name: 'name',
  surname: 'surname',
  rdgaNumber: 'rdga_number',
  town: 'town',
  pdgaNumber: 'pdga_number',
  metrixNumber: 'metrix_number',
  activeTo: 'active_to',
  sportsCategory: 'sports_category',
} satisfies Record<keyof IPlayerBase, keyof IPlayerDb>;
