import { AppRoute } from "~/libs/enums/enums";
import { useAppDispatch, useEffect, useNavigate, useTranslation } from "~/libs/hooks/hooks";
import { loginWithGoogle } from "~/modules/auth/auth";

const GOOGLE_ERROR_I18N_KEYS: Record<string, string> = {
	auth_failed: "auth.googleCallback.errors.authFailed",
	invalid_account: "auth.googleCallback.errors.invalidAccount",
	invalid_state: "auth.googleCallback.errors.invalidState",
};

const FALLBACK_ERROR_KEY = "auth.googleCallback.errors.authFailed";
const HASH_PREFIX_LENGTH = 1;

const AuthGoogleCallbackPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const parameters = new URLSearchParams(globalThis.location.hash.slice(HASH_PREFIX_LENGTH));
		const accessToken = parameters.get("access_token");
		const error = parameters.get("error");

		globalThis.history.replaceState(null, "", globalThis.location.pathname);

		if (error) {
			const i18nKey = GOOGLE_ERROR_I18N_KEYS[error] ?? FALLBACK_ERROR_KEY;
			void navigate(AppRoute.LOGIN, { state: { googleError: t(i18nKey) } });

			return;
		}

		if (accessToken) {
			void dispatch(loginWithGoogle(accessToken))
				.unwrap()
				.then(() => {
					void navigate(AppRoute.ROOT);
				})
				.catch(() => {
					void navigate(AppRoute.LOGIN, {
						state: { googleError: t(FALLBACK_ERROR_KEY) },
					});
				});

			return;
		}

		void navigate(AppRoute.LOGIN);
	}, [dispatch, navigate, t]);

	return <p>{t("auth.googleCallback.loading")}</p>;
};

export { AuthGoogleCallbackPage };
