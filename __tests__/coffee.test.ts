import { describe, expect, test, beforeEach, afterEach } from 'bun:test';
import request from 'supertest';
import app from '../src/app';
import db from '../src/database';

describe('GET /coffee', () => {
  beforeEach(async () => {
    await db.migrate.latest();
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  test('should return 418 "I\'m a teapot"', async () => {
    const response = await request(app).get('/coffee');

    expect(response.status).toBe(418);
    expect(response.text).toBe("I'm a teapot");
  });
});
