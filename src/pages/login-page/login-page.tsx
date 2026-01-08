import { Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useEffect, useNavigate } from "~/libs/hooks/hooks";
import { LoginForm } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (isAuthenticated) {
			void navigate("/");
		}
	}, [isAuthenticated, navigate]);

	return (
		<div className={getValidClassNames(styles["page"])}>
			<div className={getValidClassNames(styles["container"])}>
				<div className={getValidClassNames(styles["form-wrapper"])}>
					<h1 className={getValidClassNames(styles["title"])}>Welcome Back</h1>
					<p className={getValidClassNames(styles["subtitle"])}>Login to continue</p>

					<LoginForm />

					<p className={getValidClassNames(styles["footer-text"])}>
						Don&apos;t have an account? {""}
						<Link className={getValidClassNames(styles["link"])} to="/register">
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export { LoginPage };
