import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			exclude: ["**/node_modules/**", "**/index.ts, ", "vite.config.mts"],
			thresholds: {
				lines: 75,
				functions: 75,
				branches: 75,
				statements: 75,
			},
		},
		globals: true,
		restoreMocks: true,
	},
	plugins: [tsconfigPaths()],
});
