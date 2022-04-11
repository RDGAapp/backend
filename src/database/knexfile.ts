import path from 'path';

const defaultSettings = {
  client: 'postgresql',
  connection: {
    database: 'rdga_dev_db',
    user:     'rdga_dev',
    password: 'java_script_i_love_it'
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
    migrations: {
      ...defaultSettings.migrations,
      directory: path.join(__dirname, 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, 'seeds'),
    },
    pool: { 
      min: 1,
      max: 1,
    },
  },

  development: {
    ...defaultSettings,
  },

  production: {
    ...defaultSettings,
    connection: {
      host:     process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      user:     process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    },
  }
};

export default knexfile;
