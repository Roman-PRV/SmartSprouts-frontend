import { type Config, type EnvironmentSchema } from "./libs/types/types";
import { environmentValidationSchema } from "./libs/validation-schemas/environment.validation-schema";

class BaseConfig implements Config {
	public ENV: EnvironmentSchema;

	private get rawEnvironment(): EnvironmentSchema {
		return {
			API: {
				ORIGIN_URL: import.meta.env["VITE_APP_API_ORIGIN_URL"] as string,
				PROXY_SERVER_URL: import.meta.env["VITE_APP_PROXY_SERVER_URL"] as string,
			},
			APP: {
				ENVIRONMENT: import.meta.env["VITE_APP_NODE_ENV"] as EnvironmentSchema["APP"]["ENVIRONMENT"],
			},
		};
	}

	public constructor() {
		const result = environmentValidationSchema.safeParse(this.rawEnvironment);

		if (!result.success) {
			throw new Error(`Invalid environment configuration:\n${result.error.message}`);
		}

		this.ENV = result.data;
	}
}

export { BaseConfig };
