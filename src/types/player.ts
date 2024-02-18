import SportsCategory from 'enums/SportsCategory';

export interface IPlayerBase {
  name: string;
  surname: string | null;
  rdgaNumber: number;
  rdgaRating: number;
  rdgaRatingChange: number;
  town: string | null;
  pdgaNumber: number | null;
  metrixNumber: number | null;
  priority: number;
  activeTo: string;
  sportsCategory: SportsCategory | null;
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
