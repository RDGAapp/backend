import db from 'database';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { updateTypes } = require('knex-types');

updateTypes(db, { output: './src/types/db.ts' }).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
