import type { KnipConfig } from "knip";

const config: KnipConfig = {
	workspaces: {
		".": {
			entry: [],
			project: [],
		},
		"apps/backend": {
			project: ["src/**/*.ts"],
			paths: {
				"@/*": ["./src/*"],
			},
		},
		"apps/frontend": {
			entry: ["app/**/*.{ts,tsx}", "ui/**/*.{ts,tsx}"],
			project: ["app/**/*.{ts,tsx}", "ui/**/*.{ts,tsx}"],
		},
		"apps/backoffice": {
			entry: ["app/**/*.{ts,tsx}", "ui/**/*.{ts,tsx}"],
			project: ["app/**/*.{ts,tsx}", "ui/**/*.{ts,tsx}"],
		},
		"packages/ui": {
			project: ["src/**/*.{ts,tsx}"],
		},
		"packages/app-types": {
			project: ["src/**/*.ts"],
		},
		"packages/utils": {
			project: ["src/**/*.ts"],
		},
	},
	// @prisma/client is a runtime dep of the generated client (no direct import in source)
	// tailwindcss is consumed via PostCSS plugin, not via JS imports
	// @deck.gl/react is intentionally kept as a future dependency
	// @repo/utils is intentionally kept in backoffice for future use
	ignoreDependencies: ["@prisma/client", "tailwindcss", "@deck.gl/react", "@repo/utils"],
	// size-limit binary is used in CI yaml — not a JS import
	ignoreBinaries: ["size"],
	// Exports used only within the same file/package (e.g. internal helpers)
	ignoreExportsUsedInFile: true,
	ignore: ["packages/typescript-config/**"],
};

export default config;
