import { Button, Input, Link } from "~/libs/components/components";
import { FIRST_INDEX } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames, validateFormData } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useNavigate,
	useState,
} from "~/libs/hooks/hooks";
import { type ThunkErrorPayload } from "~/libs/types/types.js";
import {
	actions as authActions,
	register,
	registerSchema,
} from "~/modules/auth/auth";

import styles from "./styles.module.css";

const RegisterPage: React.FC = () => {
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
		setFieldErrors((previous) => ({
			...previous,
			password: "",
			password_confirmation: "",
		}));
	}, []);

	const handleConfirmPasswordChange = useCallback((value: string): void => {
		setConfirmPassword(value);
		setFieldErrors((previous) => ({
			...previous,
			password: "",
			password_confirmation: "",
		}));
	}, []);

	const handleSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>): void => {
			event.preventDefault();

			const executeSubmit = async (): Promise<void> => {
				setFieldErrors({});
				dispatch(authActions.clearError());

				const { data: validatedData, errors: validationErrors } = validateFormData(
					{ email, name, password, password_confirmation: confirmPassword },
					registerSchema
				);

				if (validationErrors) {
					setFieldErrors(validationErrors);

					return;
				}

				const result = await dispatch(register(validatedData));

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
		[name, email, password, confirmPassword, dispatch]
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
					<h1 className={getValidClassNames(styles["title"])}>Create Account</h1>
					<p className={getValidClassNames(styles["subtitle"])}>Register to get started</p>

					<form className={getValidClassNames(styles["form"])} onSubmit={handleSubmit}>
						{error && (
							<div className={getValidClassNames(styles["error-message"])} role="alert">
								{error}
							</div>
						)}

						<Input
							error={fieldErrors["name"]}
							label="Name"
							name="name"
							onChange={handleNameChange}
							placeholder="Your name"
							required
							type="text"
							value={name}
						/>

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

						<Input
							error={fieldErrors["password_confirmation"]}
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
							Register
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

export { RegisterPage };
