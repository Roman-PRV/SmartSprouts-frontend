import { Button, Input, Link } from "~/libs/components/components";
import { FIRST_INDEX } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getFormValidationErrors, getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useNavigate,
	useState,
} from "~/libs/hooks/hooks";
import { type ThunkErrorPayload } from "~/libs/types/types.js";
import { actions as authActions, login, loginSchema } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const LoginPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { dataStatus, error, isAuthenticated } = useAppSelector((state) => state.auth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleEmailChange = useCallback((value: string): void => {
		setEmail(value);
		setFieldErrors((previous) => ({ ...previous, email: "" }));
	}, []);

	const handlePasswordChange = useCallback((value: string): void => {
		setPassword(value);
		setFieldErrors((previous) => ({ ...previous, password: "" }));
	}, []);

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>): void => {
			event.preventDefault();

			const executeSubmit = async (): Promise<void> => {
				setFieldErrors({});
				dispatch(authActions.clearError());
				const validationErrors = getFormValidationErrors({ email, password }, loginSchema);

				if (validationErrors) {
					setFieldErrors(validationErrors);

					return;
				}

				const result = await dispatch(
					login({
						email,
						password,
					})
				);

				if (result.meta.requestStatus === "rejected") {
					const errorPayload = result.payload as ThunkErrorPayload | undefined;

					if (errorPayload?.errors) {
						const errors: Record<string, string> = {};

						for (const [field, messages] of Object.entries(errorPayload.errors)) {
							errors[field] = messages[FIRST_INDEX] ?? "Validation error";
						}

						setFieldErrors(errors);
					}
				}
			};

			void executeSubmit();
		},
		[email, password, dispatch]
	);

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

					<form className={getValidClassNames(styles["form"])} onSubmit={handleSubmit}>
						{error && (
							<div className={getValidClassNames(styles["error-message"])} role="alert">
								{error}
							</div>
						)}

						<Input
							error={fieldErrors["email"]}
							label="Email"
							name="email"
							onChange={handleEmailChange}
							placeholder="your@email.com"
							required
							type="email"
							value={email}
						/>

						<Input
							error={fieldErrors["password"]}
							iconLeft="lock"
							label="Password"
							name="password"
							onChange={handlePasswordChange}
							placeholder="Enter password"
							required
							type="password"
							value={password}
						/>

						<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
							Login
						</Button>
					</form>

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
