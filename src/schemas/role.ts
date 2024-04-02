import { z } from 'zod';

export const roleSchema = z.strictObject({
  code: z.string(),
  name: z.string(),
  canManagePlayers: z.boolean(),
  canManageTournaments: z.boolean(),
  canManageBlogPost: z.boolean(),
  canManageBlogPosts: z.boolean(),
  canManageRoles: z.boolean(),
  canAssignRoles: z.boolean(),
});

export const rolePutSchema = roleSchema.omit({ code: true });
