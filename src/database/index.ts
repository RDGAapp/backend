import knex from 'knex';
import knexfile from 'database/knexfile';

type Environments = 'production' | 'development';

const environment= (process.env.NODE_ENV as Environments) || 'development';

export default knex(knexfile[environment]);
