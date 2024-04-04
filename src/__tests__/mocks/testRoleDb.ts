import { IRoleDb } from 'types/roleDb';

const testRoleDb: IRoleDb = {
  code: 'test',
  name: 'Test role',
  can_manage_players: true,
  can_manage_tournaments: false,
  can_manage_blog_post: true,
  can_manage_blog_posts: false,
  can_manage_roles: true,
  can_assign_roles: false,
};

export default testRoleDb;
