import { useCallback, useNavigate } from "~/libs/hooks/hooks";
import { AuthLayout, RegisterForm } from "~/modules/auth/auth";

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();

	const handleRegisterSuccess = useCallback((): void => {
		void navigate("/");
	}, [navigate]);

	return (
		<AuthLayout
			footerLinkText="Sign in"
			footerLinkTo="/login"
			footerText="Already have an account?"
			subtitle="Register to get started"
			title="Create Account"
		>
			<RegisterForm onSuccess={handleRegisterSuccess} />
		</AuthLayout>
	);
};

export { RegisterPage };

