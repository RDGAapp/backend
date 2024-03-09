import app from 'app';
import logger from 'helpers/logger';

const PORT = process.env.APP_PORT || 8080;

app.listen(PORT, () => {
  logger.info(`app running on port ${PORT}`);
});
