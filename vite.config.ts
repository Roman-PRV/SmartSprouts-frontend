import reactPlugin from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { type ConfigEnv, loadEnv } from "vite";
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
				{
					find: "@tests",
					replacement: fileURLToPath(new URL("tests", import.meta.url)),
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
			include: ["tests/**/*.spec.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
			globals: true,
			environment: "node",
			setupFiles: "tests/setup.ts",
			// Deterministic env so config validation passes without a local .env (e.g. on CI).
			env: {
				VITE_APP_API_ORIGIN_URL: "http://localhost:3000/api",
				VITE_APP_NODE_ENV: "local",
			},
		},
	});
};

export default config;
