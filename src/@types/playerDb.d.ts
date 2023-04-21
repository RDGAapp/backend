interface PlayerDb {
  name: string;
  surname: string;
  rdga_number: number;
  rdga_rating?: number;
  rdga_rating_change?: number;
  town?: string;
  email?: string;
  pdga_number?: number;
  pdga_rating?: number;
  metrix_number?: number;
  metrix_rating?: number;
  priority?: number;
  active_to: Date;
}
