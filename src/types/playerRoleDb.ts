import { PlayerRoles } from './db';

export interface IPlayerRoleDb extends Omit<PlayerRoles, 'id'> {}
