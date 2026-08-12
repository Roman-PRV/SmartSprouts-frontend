// Tech names are shared, non-localized data — only the heading/labels are translated.
const ABOUT_STACK = [
	{
		items: ["React 19", "TypeScript", "Redux Toolkit", "React Router", "Konva", "i18next"],
		key: "frontend",
	},
	{
		items: ["Laravel 10", "PHP 8.2", "MySQL", "Redis", "Laravel Sanctum"],
		key: "backend",
	},
	{
		items: ["Docker", "Nginx", "Cloudflare R2", "Coolify"],
		key: "infrastructure",
	},
	{
		items: ["Google OAuth", "DeepL", "OpenAI", "Self-hosted TTS"],
		key: "integrations",
	},
	{
		items: ["Vitest", "PHPUnit", "ESLint", "PHPStan", "Prettier / Pint"],
		key: "quality",
	},
] as const;

export { ABOUT_STACK };
