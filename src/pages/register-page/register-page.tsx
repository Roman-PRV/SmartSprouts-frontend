import { useCallback, useNavigate, useTranslation } from "~/libs/hooks/hooks";
import { AuthLayout, RegisterForm } from "~/modules/auth/auth";

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	const handleRegisterSuccess = useCallback((): void => {
		void navigate("/");
	}, [navigate]);

	return (
		<AuthLayout
			footerLinkText={t("auth.register.footerLinkText")}
			footerLinkTo="/login"
			footerText={t("auth.register.footerText")}
			subtitle={t("auth.register.subtitle")}
			title={t("auth.register.title")}
		>
			<RegisterForm onSuccess={handleRegisterSuccess} />
		</AuthLayout>
	);
};

export { RegisterPage };
