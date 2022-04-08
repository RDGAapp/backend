const defaultSettings = {
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
};

const knexfile = {
  test: {
    ...defaultSettings,
    connection: {
      database: 'rdga_db_test',
      user:     'postgres',
      password: 'postgres'
    },
  },

  development: {
    ...defaultSettings,
    connection: {
      database: 'rdga_dev_db',
      user:     'rdga_dev',
      password: 'java_script_i_love_it'
    },
  },

  production: {
    ...defaultSettings,
  }
};

export default knexfile;
