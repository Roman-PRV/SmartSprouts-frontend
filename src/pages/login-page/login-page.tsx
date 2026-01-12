import { useCallback, useNavigate } from "~/libs/hooks/hooks";
import { AuthLayout, LoginForm } from "~/modules/auth/auth";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();

	const handleLoginSuccess = useCallback((): void => {
		void navigate("/");
	}, [navigate]);

	return (
		<AuthLayout
			footerLinkText="Register"
			footerLinkTo="/register"
			footerText="Don't have an account?"
			subtitle="Login to continue"
			title="Welcome Back"
		>
			<LoginForm onSuccess={handleLoginSuccess} />
		</AuthLayout>
	);
};

export { LoginPage };

