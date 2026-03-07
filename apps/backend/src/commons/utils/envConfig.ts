import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { z } from 'zod';

dotenvExpand.expand(config({ quiet: true }));

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('production'),

	PORT: z.coerce.number().int().positive().default(8080),
	CORS_ORIGIN: z.url().default('http://localhost:8080'),

	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce
		.number()
		.int()
		.positive()
		.default(1000),
	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce
		.number()
		.int()
		.positive()
		.default(1000),

	DATABASE_URL: z.string(),

	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.coerce.number().int().positive().default(6379),

	MINIO_ENDPOINT: z.url().default('http://localhost:9000'),
	MINIO_ROOT_USER: z.string().default('minio'),
	MINIO_ROOT_PASSWORD: z.string(),
	MINIO_BUCKET: z.string().default('website'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		'❌ Invalid environment variables:',
		JSON.stringify(z.treeifyError(parsedEnv.error), null, 2)
	);
	throw new Error('Invalid environment variables');
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === 'development',
	isProduction: parsedEnv.data.NODE_ENV === 'production',
	isTest: parsedEnv.data.NODE_ENV === 'test',
};
