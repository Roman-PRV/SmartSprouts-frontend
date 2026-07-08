import { z } from "zod";

import { type Config, type EnvironmentSchema } from "./libs/types/types";
import { environmentValidationSchema } from "./libs/validation-schemas/environment.validation-schema";

class BaseConfig implements Config {
	public ENV: EnvironmentSchema;

	private get rawEnvironment(): unknown {
		return {
			API: {
				ORIGIN_URL: import.meta.env.VITE_APP_API_ORIGIN_URL,
			},
			APP: {
				ENVIRONMENT: import.meta.env.VITE_APP_NODE_ENV,
			},
		};
	}

	public constructor() {
		const result = environmentValidationSchema.safeParse(this.rawEnvironment);

		if (!result.success) {
			throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
		}

		this.ENV = result.data;
	}
}

export { BaseConfig };
