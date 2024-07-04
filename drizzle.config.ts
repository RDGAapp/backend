import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: 'src/database',
  schema: 'src/database/schema.ts',
  dbCredentials: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: 5432,
    database: process.env.DATABASE ?? 'rdga_dev_db',
    user: process.env.DATABASE_USER ?? 'rdga_dev',
    password: process.env.DATABASE_PASSWORD ?? 'java_script_i_love_it',
    ssl: false,
  },
  verbose: true,
  strict: true,
});
