import { useCallback, useNavigate, useTranslation } from "~/libs/hooks/hooks";
import { AuthLayout, LoginForm } from "~/modules/auth/auth";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleLoginSuccess = useCallback((): void => {
		void navigate("/");
	}, [navigate]);

	return (
		<AuthLayout
			footerLinkText={t("auth.login.footerLinkText")}
			footerLinkTo="/register"
			footerText={t("auth.login.footerText")}
			subtitle={t("auth.login.subtitle")}
			title={t("auth.login.title")}
		>
			<LoginForm onSuccess={handleLoginSuccess} />
		</AuthLayout>
	);
};

export { LoginPage };
