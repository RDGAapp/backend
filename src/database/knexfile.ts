const knexfile = {
  test: {
    client: 'postgresql',
    connection: {
      database: 'rdga_db_test',
      user:     'rdga_admin',
      password: 'lol_u_believed'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: 'rdga_db',
      user:     'rdga_admin',
      password: 'lol_u_believed'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host:     process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      user:     process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

export default knexfile;
