import { IPlayerDb } from './playerDb';

export interface IPlayerBase {
  name: IPlayerDb['name'];
  surname: IPlayerDb['surname'];
  rdgaNumber: IPlayerDb['rdga_number'];
  rdgaRating: IPlayerDb['rdga_rating'];
  rdgaRatingChange: IPlayerDb['rdga_rating_change'];
  town: IPlayerDb['town'];
  pdgaNumber: IPlayerDb['pdga_number'];
  metrixNumber: IPlayerDb['metrix_number'];
  activeTo: IPlayerDb['active_to'];
  sportsCategory: IPlayerDb['sports_category'];
}

export interface IPlayer extends IPlayerBase {
  avatarUrl: string | null;
}

export interface IPlayerExtended extends IPlayer {
  metrixRating: number | null;
  metrixRatingChange: number | null;
  pdgaRating: number | null;
  pdgaActiveTo: string | null;
}
