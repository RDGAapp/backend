import db from 'database';
import { updateTypes } from 'knex-types';

updateTypes(db, { output: './src/types/db.ts' }).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
