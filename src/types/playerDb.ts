import { Player } from './db';

export interface IPlayerDb extends Omit<Player, 'active_to'> {
  active_to: string;
}
