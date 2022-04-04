import knex from 'knex';
import knexfile from 'database/knexfile';

const environment = process.env.NODE_ENV || 'development';

export default knex(knexfile[environment]);
