import db from 'database';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { updateTypes } = require('knex-types');

updateTypes(db, { output: './src/types/db.ts' }).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
