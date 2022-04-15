import knex from 'knex';
import { attachPaginate } from 'knex-paginate';
import knexfile from 'database/knexfile';

type Environments = 'production' | 'development';

const environment = (process.env.NODE_ENV as Environments) || 'development';

const db = knex(knexfile[environment]);

attachPaginate();

export default db;
