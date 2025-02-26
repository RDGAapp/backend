import { IPlayerDb } from './playerDb';

export interface IPlayerBase {
  name: IPlayerDb['name'];
  surname: IPlayerDb['surname'];
  rdgaNumber: IPlayerDb['rdga_number'];
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
  rdgaRating: number;
  rdgaRatingChange: number | null;
  metrixRating: number | null;
  metrixRatingChange: number | null;
  pdgaRating: number | null;
  pdgaRatingChange: number | null;
  pdgaActiveTo: string | null;
}
