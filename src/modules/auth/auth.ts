import { config } from "~/libs/modules/config/config.js";
import { http } from "~/libs/modules/http/http.js";
import { storage } from "~/libs/modules/storage/storage.js";

import { AuthApi } from "./auth.api.js";

const authApi = new AuthApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { authApi };
export { AuthLayout, LoginForm, RegisterForm } from "./components/components.js";
export { useAuthFormSubmit } from "./hooks/use-auth-form-submit/use-auth-form-submit.hook.js";
export { type LoginRequestDto, type RegisterRequestDto } from "./libs/types/types.js";
export { loginSchema, registerSchema } from "./libs/validation-schemas/auth.validation-schemas.js";
export { login, register } from "./slices/actions.js";
export { actions, reducer } from "./slices/auth.slice.js";
