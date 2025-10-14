import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { resolve as tsResolver } from "eslint-import-resolver-typescript";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";

/** @typedef {import("eslint").Linter.Config} */
let Config;
/** @typedef {import("eslint").Linter.ParserModule} */
let ParserModule;

const JS_MAX_PARAMS_ALLOWED = 3;

/** @type {Config[]} */
const config = [
	{
		files: ["**/*.{js,ts,tsx}"],
	},
	{
		ignores: [
			"**/*.config.{js,ts,mjs,cjs}",
			"build",
			"node_modules",
			"dist",
			"vite.config.ts",
			"project.config.ts",
			"knip.config.ts",
			"commitlint.config.ts",
		],
	},
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.browser,
				JSX: true,
				React: true,
			},
			parser: /** @type {ParserModule} */ (tsParser),
			parserOptions: {
				ecmaVersion: "latest",
				project: "./tsconfig.eslint.json",
				sourceType: "module",
			},
		},
		plugins: {
			"@stylistic": stylistic,
			"@typescript-eslint": ts,
			import: importPlugin,
			"jsx-a11y": jsxA11y,
			perfectionist,
			react,
			"react-hooks": reactHooks,
			sonarjs,
			unicorn,
		},
		rules: {
			...js.configs.recommended.rules,
			...ts.configs["strict-type-checked"].rules,
			...importPlugin.configs.recommended.rules,
			...sonarjs.configs.recommended.rules,
			...unicorn.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			...perfectionist.configs["recommended-natural"].rules,

			"@typescript-eslint/consistent-type-exports": ["error"],
			"@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{ allowTypedFunctionExpressions: true },
			],
			"@typescript-eslint/explicit-member-accessibility": ["error"],
			"@typescript-eslint/no-magic-numbers": [
				"error",
				{ ignoreEnums: true, ignoreReadonlyClassProperties: true },
			],
			"@typescript-eslint/no-unnecessary-type-parameters": "off",
			"@typescript-eslint/return-await": ["error", "always"],
			// Custom rules
			"arrow-parens": ["error", "always"],
			curly: ["error", "all"],
			"import/exports-last": ["error"],
			"import/extensions": [
				"error",
				"ignorePackages",
				{
					js: "never",
					jsx: "never",
					ts: "never",
					tsx: "never",
					json: "always",
					css: "always",
				},
			],
			"import/newline-after-import": ["error"],
			"import/no-default-export": ["error"],
			"import/no-duplicates": ["error"],
			"import/no-unresolved": ["error", { ignore: ["\\.module\\.css$"] }],
			"max-params": ["error", JS_MAX_PARAMS_ALLOWED],
			"no-console": ["error"],
			"no-multiple-empty-lines": ["error", { max: 1 }],
			"padding-line-between-statements": [
				"error",
				{ blankLine: "never", next: "export", prev: "export" },
				{ blankLine: "always", next: "*", prev: ["block-like", "throw"] },
				{ blankLine: "always", next: ["return", "block-like", "throw"], prev: "*" },
			],
			"perfectionist/sort-named-exports": ["error", { groupKind: "types-first" }],
			quotes: ["error", "double"],
			"react/jsx-no-bind": ["error", { ignoreRefs: true }],
			"react/prop-types": "off",
			"react/react-in-jsx-scope": ["off"],
			"unicorn/no-null": ["off"],
			"sonarjs/todo-tag": "off",
		},
		settings: {
			"import/parsers": {
				espree: [".js", ".cjs"],
			},
			"import/resolver": {
				typescript: tsResolver,
			},
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
			},
			react: {
				version: "detect",
			},
		},
	},
	{
		files: ["vite.config.ts"],
		rules: {
			"import/no-default-export": ["off"],
		},
	},
	{
		files: ["src/vite-env.d.ts"],
		rules: {
			"unicorn/prevent-abbreviations": ["off"],
		},
	},
	{
		files: ["*.js"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": ["off"],
		},
	},
];

export default config;
