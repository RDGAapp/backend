import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const pool = new Pool({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: 5432,
  database: process.env.DATABASE ?? 'rdga_dev_db',
  user: process.env.DATABASE_USER ?? 'rdga_dev',
  password: process.env.DATABASE_PASSWORD ?? 'java_script_i_love_it',
  ssl: false,
});

export const db = drizzle(pool, { schema });
