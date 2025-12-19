import { Button, Input, Link } from "~/libs/components/components";
import { FIRST_INDEX } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useNavigate,
	useState,
} from "~/libs/hooks/hooks";
import { actions as authActions, register } from "~/modules/auth/auth";

import styles from "./styles.module.css";

const VALIDATION_MATCH_ERROR = "Passwords do not match";

const SignupPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { dataStatus, error, isAuthenticated } = useAppSelector((state) => state.auth);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleNameChange = useCallback((value: string): void => {
		setName(value);
		setFieldErrors((previous) => ({ ...previous, name: "" }));
	}, []);

	const handleEmailChange = useCallback((value: string): void => {
		setEmail(value);
		setFieldErrors((previous) => ({ ...previous, email: "" }));
	}, []);

	const handlePasswordChange = useCallback((value: string): void => {
		setPassword(value);
		setFieldErrors((previous) => ({ ...previous, password: "" }));
	}, []);

	const handleConfirmPasswordChange = useCallback((value: string): void => {
		setConfirmPassword(value);
		setFieldErrors((previous) => ({ ...previous, password_confirmation: "" }));
	}, []);

	const handleSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
			event.preventDefault();

			// Clear previous errors
			setFieldErrors({});
			dispatch(authActions.clearError());

			// Client-side validation
			if (password !== confirmPassword) {
				setFieldErrors({
					password_confirmation: VALIDATION_MATCH_ERROR,
				});

				return;
			}

			// Dispatch register action
			const result = await dispatch(
				register({
					email,
					name,
					password,
					password_confirmation: confirmPassword,
				})
			);

			// Handle validation errors from backend
			if (result.meta.requestStatus === "rejected") {
				const errorPayload = result.payload as {
					errors?: Record<string, string[]>;
				};

				if (errorPayload.errors) {
					const errors: Record<string, string> = {};

					// Convert array of errors to single string (take first error)
					for (const [field, messages] of Object.entries(errorPayload.errors)) {
						errors[field] = messages[FIRST_INDEX] ?? "Validation error";
					}

					setFieldErrors(errors);
				}
			}
		},
		[name, email, password, confirmPassword, dispatch]
	);

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>): void => {
			void handleSubmit(event);
		},
		[handleSubmit]
	);

	// Redirect to home page after successful registration
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
					<p className={getValidClassNames(styles["subtitle"])}>Sign up to get started</p>

					<form className={getValidClassNames(styles["form"])} onSubmit={handleFormSubmit}>
						{error && (
							<div className={getValidClassNames(styles["error-message"])} role="alert">
								{error}
							</div>
						)}

						<Input
							error={fieldErrors["name"] || null}
							label="Name"
							name="name"
							onChange={handleNameChange}
							placeholder="Your name"
							required
							type="text"
							value={name}
						/>

						<Input
							error={fieldErrors["email"] || null}
							label="Email"
							name="email"
							onChange={handleEmailChange}
							placeholder="your@email.com"
							required
							type="email"
							value={email}
						/>

						<Input
							error={fieldErrors["password"] || null}
							iconLeft="lock"
							label="Password"
							name="password"
							onChange={handlePasswordChange}
							placeholder="Enter password"
							required
							type="password"
							value={password}
						/>

						<Input
							error={fieldErrors["password_confirmation"] || null}
							iconLeft="lock"
							label="Confirm Password"
							name="password_confirmation"
							onChange={handleConfirmPasswordChange}
							placeholder="Confirm password"
							required
							type="password"
							value={confirmPassword}
						/>

						<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
							Sign Up
						</Button>
					</form>

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

export { SignupPage };
