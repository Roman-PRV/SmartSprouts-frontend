import { type KnipConfig } from "knip";

const config: KnipConfig = {
	entry: [
		"src/main.tsx",
		"src/games/arithmetic/arithmetic.ts",
		"src/games/find-the-wrong/find-the-wrong.ts",
		"src/libs/hooks/use-card-board/use-card-board.hook.ts",
	],
	project: ["src/**/*.ts", "src/**/*.tsx", "src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}"],
	ignore: ["src/vite-env.d.ts", "**/*.test.ts"],
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.js"],
	ignoreDependencies: ["husky", "tailwindcss"],
};

export default config;
