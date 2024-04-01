import { IRole } from 'types/role';
import { IRoleDb } from 'types/roleDb';

export default {
  code: 'code',
  name: 'name',
  canManagePlayers: 'can_manage_players',
  canManageTournaments: 'can_manage_tournaments',
  canManageBlogPost: 'can_manage_blog_post',
  canManageBlogPosts: 'can_manage_blog_posts',
  canManageRoles: 'can_manage_roles',
  canAssignRoles: 'can_assign_roles',
} satisfies Record<keyof IRole, keyof IRoleDb>;
