import { RuleConfigSeverity, type UserConfig } from "@commitlint/types";

import { ProjectPrefix } from "./project.config";

const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: {
		parserOpts: {
			issuePrefixes: ProjectPrefix.ISSUE_PREFIXES.map((prefix) => `${prefix}-`),
		},
	},
	rules: {
		"references-empty": [RuleConfigSeverity.Error, "never"],
	},
};

export default config;
