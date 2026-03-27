import cron from 'node-cron';
import { leaveService } from '@/api/leave/leaveService';
import { env } from '@/commons/utils/envConfig';
import app from '@/server';

const server = app.listen(env.PORT, () => {
	const { NODE_ENV, PORT } = env;
	console.info(
		`Server (${NODE_ENV}) running on port http://localhost:${PORT}`
	);
});

// Delete expired leaves every day at 1am
cron.schedule('0 1 * * *', () => leaveService.deleteExpired());

const onCloseSignal = () => {
	console.info('sigint received, shutting down');
	server.close(() => {
		console.info('server closed');
		process.exit();
	});
	setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);
