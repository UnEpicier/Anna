import { env } from '@/commons/utils/envConfig';
import { createClient, type RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
	url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
	password: env.REDIS_PASSWORD,
});
redisClient.on('error', (err) => console.error('Redis Client Error', err));

export default redisClient;

// Export a function to test the redis connection
export const testRedisConnection = async () => {
	try {
		await redisClient.connect();
		await redisClient.ping();
		console.info('Redis connection successful');
	} catch (error) {
		console.error('Redis connection failed', error);
	}
};
