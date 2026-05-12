import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { useAppDispatch, useCallback, useState, useTranslation } from "~/libs/hooks/hooks";

import { fetchGoogleRedirectUrl } from "../../slices/actions";

const GoogleLoginButton: React.FC = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	const handleClick = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		try {
			const url = await dispatch(fetchGoogleRedirectUrl()).unwrap();
			globalThis.location.href = url;
		} catch {
			toast.error(t("auth.login.googleErrors.redirectFailed"));
			setIsLoading(false);
		}
	}, [dispatch, t]);

	return (
		<Button fullWidth isLoading={isLoading} onClick={handleClick} size="lg" variant="secondary">
			{t("auth.login.googleButton")}
		</Button>
	);
};

export { GoogleLoginButton };
