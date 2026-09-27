import { type KnipConfig } from "knip";

const config: KnipConfig = {
	// Module barrels are public surfaces: an export can land an issue ahead of
	// the screen that consumes it without being dead.
	entry: [
		"src/main.tsx",
		"src/games/find-the-wrong/find-the-wrong.ts",
		"src/modules/entitlement/entitlement.ts",
	],
	project: ["src/**/*.ts", "src/**/*.tsx", "src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}"],
	ignore: ["src/vite-env.d.ts", "**/*.test.ts"],
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.js"],
	ignoreDependencies: ["husky", "tailwindcss"],
};

export default config;
