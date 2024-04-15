import { IPlayerRoleDb } from './playerRoleDb';

export interface IPlayerRole {
  id: IPlayerRoleDb['id'];
  playerRdgaNumber: IPlayerRoleDb['player_rdga_number'];
  roleCode: IPlayerRoleDb['role_code'];
}
