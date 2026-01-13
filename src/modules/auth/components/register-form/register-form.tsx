import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "~/libs/components/components";
import { VALIDATION_RULES } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector, useForm, useTranslation } from "~/libs/hooks/hooks";
import {
	register as registerAction,
	type RegisterRequestDto,
	registerSchema,
	useAuthFormSubmit,
} from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

type Properties = {
	onSuccess?: () => void;
};

const RegisterForm: React.FC<Properties> = ({ onSuccess }) => {
	const { t } = useTranslation();
	const { dataStatus, error } = useAppSelector((state) => state.auth);

	const {
		formState: { errors },
		handleSubmit,
		register,
		setError,
	} = useForm<RegisterRequestDto>({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			password_confirmation: "",
		},
		resolver: zodResolver(registerSchema),
	});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleFormSubmit = useAuthFormSubmit({
		action: registerAction,
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
				error={
					errors.name?.message &&
					t(errors.name.message, {
						min: VALIDATION_RULES.MIN_NAME_LENGTH,
					})
				}
				label={t("auth.register.fields.name.label")}
				placeholder={t("auth.register.fields.name.placeholder")}
				required
				type="text"
				{...register("name")}
			/>

			<Input
				error={errors.email?.message && t(errors.email.message)}
				label={t("auth.register.fields.email.label")}
				placeholder={t("auth.register.fields.email.placeholder")}
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
				label={t("auth.register.fields.password.label")}
				placeholder={t("auth.register.fields.password.placeholder")}
				required
				type="password"
				{...register("password")}
			/>

			<Input
				error={errors.password_confirmation?.message && t(errors.password_confirmation.message)}
				iconLeft="lock"
				label={t("auth.register.fields.confirmPassword.label")}
				placeholder={t("auth.register.fields.confirmPassword.placeholder")}
				required
				type="password"
				{...register("password_confirmation")}
			/>

			<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
				{t("auth.register.button")}
			</Button>
		</form>
	);
};

export { RegisterForm };
