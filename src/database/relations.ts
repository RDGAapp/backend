import { relations } from 'drizzle-orm/relations';
import { player, authData, post, playerRoles, role } from './schema';

export const authDataRelations = relations(authData, ({ one }) => ({
  player: one(player, {
    fields: [authData.rdgaNumber],
    references: [player.rdgaNumber],
  }),
}));

export const playerRelations = relations(player, ({ many }) => ({
  auth_data: many(authData),
  posts: many(post),
  player_roles: many(playerRoles),
}));

export const postRelations = relations(post, ({ one }) => ({
  player: one(player, {
    fields: [post.authorRdgaNumber],
    references: [player.rdgaNumber],
  }),
}));

export const player_rolesRelations = relations(playerRoles, ({ one }) => ({
  player: one(player, {
    fields: [playerRoles.playerRdgaNumber],
    references: [player.rdgaNumber],
  }),
  role: one(role, {
    fields: [playerRoles.roleCode],
    references: [role.code],
  }),
}));

export const roleRelations = relations(role, ({ many }) => ({
  player_roles: many(playerRoles),
}));
