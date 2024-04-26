import { IPlayerDb } from './playerDb';
import { IBlogPostDb } from './postDb';

export interface IPlayerRole {
  playerRdgaNumber: IPlayerDb['rdga_number'];
  roleCode: IBlogPostDb['code'];
}
