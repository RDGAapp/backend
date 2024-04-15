import request from 'supertest';
import app from '../src/app';
import db from '../src/database';

const baseRoles = [
  {
    canAssignRoles: true,
    canManageBlogPost: true,
    canManageBlogPosts: true,
    canManagePlayers: true,
    canManageRoles: true,
    canManageTournaments: true,
    code: 'su',
    name: 'SuperUser',
  },
  {
    canAssignRoles: false,
    canManageBlogPost: true,
    canManageBlogPosts: true,
    canManagePlayers: true,
    canManageRoles: false,
    canManageTournaments: true,
    code: 'admin',
    name: 'Administrator',
  },
  {
    canAssignRoles: false,
    canManageBlogPost: true,
    canManageBlogPosts: false,
    canManagePlayers: false,
    canManageRoles: false,
    canManageTournaments: false,
    code: 'author',
    name: 'Author',
  },
];

describe('Role endpoints', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  describe('GET /roles', () => {
    test('should return 200 with base roles', async () => {
      const response = await request(app).get('/roles');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(baseRoles);
    });
  });

  describe('GET /roles/:roleCode', () => {
    test('should return 200 and role', async () => {
      const response = await request(app).get('/roles/su');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(baseRoles[0]);
    });
  });
});
