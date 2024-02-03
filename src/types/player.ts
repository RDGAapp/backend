export interface IPlayer {
  name: string;
  surname: string | null;
  rdgaNumber: number;
  rdgaRating: number;
  rdgaRatingChange: number;
  town: string | null;
  email: string;
  pdgaNumber: number | null;
  pdgaRating: number | null;
  metrixNumber: number | null;
  priority: number;
  activeTo: Date;
}

export interface IPlayerExtended extends IPlayer {
  metrixRating: number | null;
  metrixRatingChange: number | null;
}
