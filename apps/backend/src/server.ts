import { authRouter } from '@/api/auth/authRouter';
import { departmentsRouter } from '@/api/departments/departmentsRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { informationsRouter } from '@/api/informations/informationsRouter';
import { leaveRouter } from '@/api/leave/leaveRouter';
import { announcementRouter } from '@/api/announcement/announcementRouter';
import { schedulesRouter } from '@/api/schedules/schedulesRouter';
import { servicesRouter } from '@/api/services/servicesRouter';
import errorHandler from '@/commons/middleware/errorHandler';
import rateLimiter from '@/commons/middleware/rateLimiter';
import { env } from '@/commons/utils/envConfig';
import { testDBConnection } from '@/libs/prisma';
import { testRedisConnection } from '@/libs/redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

await testDBConnection();
await testRedisConnection();

const app: Express = express();

// Set the application to trust the first reverse proxy only
app.set('trust proxy', 1);

// Middlewares
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));
app.use(cookieParser());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Routes
app.use('/auth', authRouter);
app.use('/departments', departmentsRouter);
app.use('/health-check', healthCheckRouter);
app.use('/informations', informationsRouter);
app.use('/leave', leaveRouter);
app.use('/announcement', announcementRouter);
app.use('/schedules', schedulesRouter);
app.use('/services', servicesRouter);

// Error handlers
app.use(errorHandler());

export default app;
