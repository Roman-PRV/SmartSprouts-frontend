import { config } from "~/libs/modules/config/config";
import { http } from "~/libs/modules/http/http";
import { storage } from "~/libs/modules/storage/storage";

import { AuthApi } from "./auth.api";

const authApi = new AuthApi({
	baseUrl: config.ENV.API.ORIGIN_URL,
	http,
	storage,
});

export { authApi };
export { AuthLayout, LoginForm, RegisterForm } from "./components/components";
export { useAuthFormSubmit, useLogout } from "./hooks/hooks";
export { type LoginRequestDto, type RegisterRequestDto } from "./libs/types/types";
export { loginSchema, registerSchema } from "./libs/validation-schemas/auth.validation-schemas";
export { getAuthenticatedUser, login, logout, register } from "./slices/actions";
export { actions, reducer } from "./slices/auth.slice";
