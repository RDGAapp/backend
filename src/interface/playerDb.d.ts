interface PlayerDb {
  id: number;
  name: string;
  surname: string;
  middle_name: string;
  rdga_number: number;
  rdga_rating: number;
  rdga_rating_change?: number;
  town?: string;
  date_of_birth?: Date;
  email?: string;
  pdga_number?: number;
  pdga_rating?: number;
  metrix_number?: number;
  metrix_rating?: number;
}
