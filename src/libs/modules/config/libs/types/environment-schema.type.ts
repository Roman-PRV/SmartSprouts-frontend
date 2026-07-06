import { type z } from "zod";

import { type environmentValidationSchema } from "../validation-schemas/environment.validation-schema";

type EnvironmentSchema = z.infer<typeof environmentValidationSchema>;

export { type EnvironmentSchema };
