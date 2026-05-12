import logger from './logger/winston.logger';
import express, { Router } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

const router = Router();
const app = express();

// Middlewares

app.use(
  express.json({
    limit: '16kb',
  }),
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '16kb',
  }),
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.static('public'));
app.use(helmet());

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

// Routes

router.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    timeStamp: new Date(),
  });
});

// Auth Routes

import authRouter from "./modules/auth/auth.routes";

app.use(router);
app.use('/api/v1/auth', authRouter);

export default app;
