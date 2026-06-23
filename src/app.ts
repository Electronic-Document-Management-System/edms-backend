import logger from './logger/winston.logger';
import express, { Router } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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
app.use(cookieParser());
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


import authRouter from './modules/auth/auth.routes';
import rbacRouter from './modules/rbac/rbac.route';
import usersRouter from './modules/users/users.route';
import auditRouter from './modules/audit/audit.route';
import departmentRouter from './modules/departments/department.route';
import documentVersionsRouter from './modules/document_versions/documentVersions.route';
import documentRouter from './modules/documents/document.route';
import folderRouter from './modules/folders/folders.route';
import reportRouter from './modules/reports/report.route';
import metadataRouter from './modules/metadata/metadata.route';
import workflowRouter from './modules/workflow/workflow.route';
import notificationRouter from './modules/notification/notification.route';
import { errorHandler } from './middlewares/error.middleware';

app.use(router);
app.use('/api/v1/tenant/auth', authRouter);
app.use('/api/v1/tenant/rbac', rbacRouter);
app.use('/api/v1/tenant/users', usersRouter);
app.use('/api/v1/tenant/audit', auditRouter);
app.use('/api/v1/tenant/departments', departmentRouter);
app.use('/api/v1/tenant/document', documentRouter);
app.use('/api/v1/tenant/documents/:id/versions', documentVersionsRouter);
app.use('/api/v1/tenant/folders', folderRouter);
app.use('/api/v1/tenant/report', reportRouter);
app.use('/api/v1/tenant/metadata', metadataRouter);
app.use('/api/v1/tenant/workflow', workflowRouter);
app.use('/api/v1/tenant/notification', notificationRouter);

app.use(errorHandler);
export default app;
