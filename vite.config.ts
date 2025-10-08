import reactPlugin from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { type ConfigEnv, defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig as defineVitestConfig } from "vitest/config";

const config = ({ mode }: ConfigEnv) => {
	const { VITE_APP_API_ORIGIN_URL, VITE_APP_DEVELOPMENT_PORT, VITE_APP_PROXY_SERVER_URL } = loadEnv(
		mode,
		process.cwd()
	);

	return defineVitestConfig({
		build: {
			outDir: "build",
		},
		plugins: [reactPlugin(), svgr(), tailwindcss()],
		resolve: {
			alias: [
				{
					find: "~",
					replacement: fileURLToPath(new URL("src", import.meta.url)),
				},
			],
		},
		server: {
			port: Number(VITE_APP_DEVELOPMENT_PORT),
			proxy: {
				[VITE_APP_API_ORIGIN_URL as string]: {
					changeOrigin: true,
					target: VITE_APP_PROXY_SERVER_URL,
				},
			},
		},
		test: {
			include: ["tests/**/*.spec.ts", "src/**/*.spec.ts"],
			globals: true,
			environment: "node",
			setupFiles: "tests/setup.ts",
		},
	});
};

export default config;
