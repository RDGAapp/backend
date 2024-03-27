import SportsCategory from 'enums/SportsCategory';
import { Players } from './db';

export interface IPlayerDb extends Omit<Players, 'active_to'> {
  active_to: string;
  sports_category: SportsCategory | null;
}
