import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/commons/utils/envConfig";
import { PrismaClient } from "@/generated/prisma-client/client";

const adapter = new PrismaPg({
	connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter: adapter });
export default prisma;

export const testDBConnection = async () => {
	try {
		await prisma.$connect();
		console.info("Database connection successful");
	} catch (error) {
		console.error("Database connection failed", error);
	} finally {
		await prisma.$disconnect();
	}
};
