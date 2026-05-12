import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "~/libs/components/components";
import { VALIDATION_RULES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useForm, useLocation, useTranslation } from "~/libs/hooks/hooks";
import { login, type LoginRequestDto, loginSchema, useAuthFormSubmit } from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

import { GoogleLoginButton } from "../google-login-button/google-login-button";

type Properties = {
	onSuccess?: () => void;
};

const LoginForm: React.FC<Properties> = ({ onSuccess }) => {
	const { t } = useTranslation();
	const { dataStatus, error } = useAppSelector((state) => state.auth);
	const location = useLocation();
	const googleError = (location.state as null | { googleError?: string })?.googleError;

	const {
		formState: { errors },
		handleSubmit,
		register,
		setError,
	} = useForm<LoginRequestDto>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleFormSubmit = useAuthFormSubmit({
		action: login,
		onSuccess,
		setError,
	});

	return (
		<form
			className={getValidClassNames(styles["auth-form"])}
			noValidate
			onSubmit={handleSubmit(handleFormSubmit)}
		>
			{googleError && (
				<div className={getValidClassNames(styles["auth-form__error"])} role="alert">
					{googleError}
				</div>
			)}

			{error && (
				<div className={getValidClassNames(styles["auth-form__error"])} role="alert">
					{error.message}
				</div>
			)}

			<Input
				error={errors.email?.message && t(errors.email.message)}
				label={t("auth.login.fields.email.label")}
				placeholder={t("auth.login.fields.email.placeholder")}
				required
				type="email"
				{...register("email")}
			/>

			<Input
				error={
					errors.password?.message &&
					t(errors.password.message, {
						min: VALIDATION_RULES.MIN_PASSWORD_LENGTH,
					})
				}
				iconLeft="lock"
				label={t("auth.login.fields.password.label")}
				placeholder={t("auth.login.fields.password.placeholder")}
				required
				type="password"
				{...register("password")}
			/>

			<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
				{t("auth.login.button")}
			</Button>

			<div className={styles["auth-form__divider"]}>{t("auth.login.orDivider")}</div>

			<GoogleLoginButton />
		</form>
	);
};

export { LoginForm };
