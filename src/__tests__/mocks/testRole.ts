import { IRole } from 'types/role';

const testRole: IRole = {
  code: 'test',
  name: 'Test role',
  canManagePlayers: true,
  canManageTournaments: false,
  canManageBlogPost: true,
  canManageBlogPosts: false,
  canManageRoles: true,
  canAssignRoles: false,
};

export default testRole;
