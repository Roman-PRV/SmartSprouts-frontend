import { useAppSelector, useEffect, useNavigate } from "~/libs/hooks/hooks";
import { AuthLayout, LoginForm } from "~/modules/auth/auth";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (isAuthenticated) {
			void navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<AuthLayout
			footerLinkText="Register"
			footerLinkTo="/register"
			footerText="Don't have an account?"
			subtitle="Login to continue"
			title="Welcome Back"
		>
			<LoginForm />
		</AuthLayout>
	);
};

export { LoginPage };
