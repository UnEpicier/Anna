import { env } from '@/commons/utils/envConfig';
import {
	CreateBucketCommand,
	ListBucketsCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

export const bucket = env.MINIO_BUCKET;

export const s3 = new S3Client({
	region: 'us-east-1',
	endpoint: env.MINIO_ENDPOINT,
	credentials: {
		accessKeyId: env.MINIO_ROOT_USER,
		secretAccessKey: env.MINIO_ROOT_PASSWORD,
	},
	forcePathStyle: true,
});

const storage = multerS3({
	s3,
	bucket,
	metadata: (_req, file, cb) => {
		cb(null, { fieldName: file.fieldname });
	},
	key: (_req, _file, cb) => {
		cb(null, crypto.randomUUID());
	},
});

export const upload = multer({ storage });

export async function initBucket() {
	console.info('Bucket initialization...');
	try {
		const bucketsList = await s3.send(new ListBucketsCommand());

		if (bucketsList.Buckets?.some((b) => b.Name === bucket)) {
			console.info('Bucket initialized');
			return;
		}
	} catch (error) {
		console.error('Error listing bucket:', error);
	}

	try {
		await s3.send(
			new CreateBucketCommand({
				Bucket: bucket,
			})
		);
	} catch (error: any) {
		if (error.name !== 'BucketAlreadyOwnedByYou') {
			console.error('Error creating bucket:', error);
		}
	}
	console.info('Bucket initialized');
}
