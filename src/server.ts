import dotenv from "dotenv";
dotenv.config()

import logger from './logger/winston.logger';
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
