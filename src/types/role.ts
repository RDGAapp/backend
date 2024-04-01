import { IRoleDb } from './roleDb';

export interface IRole {
  code: IRoleDb['code'];
  name: IRoleDb['name'];
  canManagePlayers: IRoleDb['can_manage_players'];
  canManageTournaments: IRoleDb['can_manage_tournaments'];
  canManageBlogPost: IRoleDb['can_manage_blog_post'];
  canManageBlogPosts: IRoleDb['can_manage_blog_posts'];
  canManageRoles: IRoleDb['can_manage_roles'];
  canAssignRoles: IRoleDb['can_assign_roles'];
}
