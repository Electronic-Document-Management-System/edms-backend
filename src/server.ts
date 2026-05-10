import dotenv from "dotenv";
dotenv.config()

import logger from './logger/winston.logger';
import app from './app';
import { connectDB } from "./config/db.config";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  logger.info(`⚙️  Server running on port ${PORT}`);
});
