import { config } from "dotenv";
import dotenvExpand from "dotenv-expand";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

dotenvExpand.expand(config({ quiet: true }));

export default {
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
} satisfies PrismaConfig;
