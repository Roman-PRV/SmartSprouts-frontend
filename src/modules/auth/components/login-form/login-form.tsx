import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useForm, useTranslation } from "~/libs/hooks/hooks";
import { login, type LoginRequestDto, loginSchema, useAuthFormSubmit } from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

type Properties = {
	onSuccess?: () => void;
};

const LoginForm: React.FC<Properties> = ({ onSuccess }) => {
	const { t } = useTranslation();
	const { dataStatus, error } = useAppSelector((state) => state.auth);

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
			{error && (
				<div className={getValidClassNames(styles["auth-form__error"])} role="alert">
					{error}
				</div>
			)}

			<Input
				error={errors.email?.message}
				label={t("auth.login.fields.email.label")}
				placeholder={t("auth.login.fields.email.placeholder")}
				required
				type="email"
				{...register("email")}
			/>

			<Input
				error={errors.password?.message}
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
		</form>
	);
};

export { LoginForm };
