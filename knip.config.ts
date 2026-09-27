import { type KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["src/main.tsx", "src/games/find-the-wrong/find-the-wrong.ts"],
	// An export tagged @planned is waiting for a consumer from the next issue.
	// The tag is removed by the issue that consumes it, not left to rot.
	tags: ["-planned"],
	project: ["src/**/*.ts", "src/**/*.tsx", "src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}"],
	ignore: ["src/vite-env.d.ts", "**/*.test.ts"],
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.js"],
	ignoreDependencies: ["husky", "tailwindcss"],
};

export default config;
