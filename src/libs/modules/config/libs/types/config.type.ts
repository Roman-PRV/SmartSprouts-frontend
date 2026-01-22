import { type Config as LibraryConfig } from "~/libs/types/config.type";

import { type EnvironmentSchema } from "./types";

type Config = LibraryConfig<EnvironmentSchema>;

export { type Config };
