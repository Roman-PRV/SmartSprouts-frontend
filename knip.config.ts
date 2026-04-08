import { type KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["src/main.tsx"],
	project: ["src/**/*.ts", "src/**/*.tsx", "src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}"],
	ignore: ["src/vite-env.d.ts", "**/*.test.ts"],
	prettier: ["./prettier.config.js"],
	stylelint: ["./stylelint.config.js"],
};

export default config;
