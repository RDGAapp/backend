import { IPlayerRole } from 'types/playerRole';
import { IPlayerRoleDb } from 'types/playerRoleDb';

export default {
  playerRdgaNumber: 'player_rdga_number',
  roleCode: 'role_code',
} satisfies Record<keyof IPlayerRole, keyof IPlayerRoleDb>;
