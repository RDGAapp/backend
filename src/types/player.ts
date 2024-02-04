export interface IPlayer {
  name: string;
  surname: string | null;
  rdgaNumber: number;
  rdgaRating: number;
  rdgaRatingChange: number;
  town: string | null;
  email: string;
  pdgaNumber: number | null;
  metrixNumber: number | null;
  priority: number;
  activeTo: string;
}

export interface IPlayerExtended extends IPlayer {
  metrixRating: number | null;
  metrixRatingChange: number | null;
  pdgaRating: number | null;
  pdgaActiveTo: string | null;
}
