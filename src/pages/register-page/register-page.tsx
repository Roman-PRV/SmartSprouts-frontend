import { Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useEffect, useNavigate } from "~/libs/hooks/hooks";
import { RegisterForm } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const RegisterPage: React.FC = () => {
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
					<h1 className={getValidClassNames(styles["title"])}>Create Account</h1>
					<p className={getValidClassNames(styles["subtitle"])}>Register to get started</p>

					<RegisterForm />

					<p className={getValidClassNames(styles["footer-text"])}>
						Already have an account?{" "}
						<Link className={getValidClassNames(styles["link"])} to="/login">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export { RegisterPage };
