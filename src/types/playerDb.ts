import SportsCategory from 'enums/SportsCategory';

export interface IPlayerDb {
  name: string;
  surname: string | null;
  rdga_number: number;
  rdga_rating: number;
  rdga_rating_change: number | null;
  town: string | null;
  pdga_number: number | null;
  metrix_number: number | null;
  priority: number | null;
  active_to: string;
  sports_category: SportsCategory | null;
}
