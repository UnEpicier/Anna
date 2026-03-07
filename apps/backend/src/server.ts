import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { authRouter } from '@/api/auth/authRouter';
import { blogRouter } from '@/api/blog/blogRouter';
import { departmentsRouter } from '@/api/departments/departmentsRouter';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { informationsRouter } from '@/api/informations/informationsRouter';
import { leaveRouter } from '@/api/leave/leaveRouter';
import { schedulesRouter } from '@/api/schedules/schedulesRouter';
import { servicesRouter } from '@/api/services/servicesRouter';
import errorHandler from '@/commons/middleware/errorHandler';
import rateLimiter from '@/commons/middleware/rateLimiter';
import { env } from '@/commons/utils/envConfig';
import { initBucket } from '@/libs/bucket';
import { testDBConnection } from '@/libs/prisma';
import { testRedisConnection } from '@/libs/redis';

await testDBConnection();
await testRedisConnection();
await initBucket();

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(morgan(env.isProduction ? 'combined' : 'dev'));

// Routes
app.use('/auth', authRouter);
app.use('/blog', blogRouter);
app.use('/departments', departmentsRouter);
app.use('/health-check', healthCheckRouter);
app.use('/informations', informationsRouter);
app.use('/leave', leaveRouter);
app.use('/schedules', schedulesRouter);
app.use('/services', servicesRouter);

// Error handlers
app.use(errorHandler());

export default app;
