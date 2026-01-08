import { useAppSelector, useEffect, useNavigate } from "~/libs/hooks/hooks";
import { AuthLayout, RegisterForm } from "~/modules/auth/auth";

const RegisterPage: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (isAuthenticated) {
			void navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<AuthLayout
			footerLinkText="Sign in"
			footerLinkTo="/login"
			footerText="Already have an account?"
			subtitle="Register to get started"
			title="Create Account"
		>
			<RegisterForm />
		</AuthLayout>
	);
};

export { RegisterPage };
