import { type Config as LibraryConfig } from "~/libs/types/config.type.js";

import { type EnvironmentSchema } from "./types.js";

type Config = LibraryConfig<EnvironmentSchema>;

export { type Config };
