import { migrate } from 'drizzle-orm/node-postgres/migrator';
import path from 'path';
import app from 'app';
import logger from 'helpers/logger';
import { db } from 'database';

const PORT = process.env.APP_PORT || 8080;

(async () => {
  await migrate(db, { migrationsFolder: path.join(__dirname, 'database') });

  app.listen(PORT, () => {
    logger.info(`app running on port ${PORT}`);
  });
})();
