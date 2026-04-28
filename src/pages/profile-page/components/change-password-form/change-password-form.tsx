import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "~/libs/components/components";
import { FIRST_INDEX, VALIDATION_RULES } from "~/libs/constants/constants";
import { useAppDispatch, useForm, useTranslation } from "~/libs/hooks/hooks";
import { type ThunkErrorPayload } from "~/libs/types/types";
import {
	updatePassword,
	type UpdatePasswordRequestDto,
	updatePasswordValidationSchema,
} from "~/modules/profile/profile";

import styles from "./styles.module.css";

const ChangePasswordForm: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		reset,
		setError,
	} = useForm<UpdatePasswordRequestDto>({
		defaultValues: {
			current_password: "",
			new_password: "",
			new_password_confirmation: "",
		},
		resolver: zodResolver(updatePasswordValidationSchema),
	});

	const handleFormSubmit = async (payload: UpdatePasswordRequestDto): Promise<void> => {
		try {
			await dispatch(updatePassword(payload)).unwrap();
			reset();
			// Optionally add toast notification here
			alert(t("profile.changePassword.success", "Пароль успішно змінено!"));
		} catch (error) {
			const errorPayload = error as ThunkErrorPayload;

			if (errorPayload.errors) {
				for (const [field, messages] of Object.entries(errorPayload.errors)) {
					if (field in payload) {
						setError(field as keyof UpdatePasswordRequestDto, {
							message: messages[FIRST_INDEX] ?? "Validation error",
						});
					}
				}
			}
		}
	};

	return (
		<div className={styles["card"]}>
			<h2 className={styles["card__title"]}>{t("profile.changePassword.title", "Зміна пароля")}</h2>
			<form
				className={styles["form"]}
				noValidate
				onSubmit={handleSubmit(handleFormSubmit)}
			>
				<Input
					error={errors.current_password?.message && t(errors.current_password.message)}
					iconLeft="lock"
					label={t("profile.changePassword.fields.currentPassword.label", "Поточний пароль")}
					placeholder={t("profile.changePassword.fields.currentPassword.placeholder", "Введіть поточний пароль")}
					required
					type="password"
					{...register("current_password")}
				/>

				<Input
					error={
						errors.new_password?.message &&
						t(errors.new_password.message, {
							min: VALIDATION_RULES.MIN_PASSWORD_LENGTH,
						})
					}
					iconLeft="lock"
					label={t("profile.changePassword.fields.newPassword.label", "Новий пароль")}
					placeholder={t("profile.changePassword.fields.newPassword.placeholder", "Введіть новий пароль")}
					required
					type="password"
					{...register("new_password")}
				/>

				<Input
					error={errors.new_password_confirmation?.message && t(errors.new_password_confirmation.message)}
					iconLeft="lock"
					label={t("profile.changePassword.fields.confirmPassword.label", "Підтвердження нового пароля")}
					placeholder={t("profile.changePassword.fields.confirmPassword.placeholder", "Повторіть новий пароль")}
					required
					type="password"
					{...register("new_password_confirmation")}
				/>

				<Button fullWidth isLoading={isSubmitting} size="md" type="submit" variant="primary">
					{t("profile.changePassword.button", "Змінити пароль")}
				</Button>
			</form>
		</div>
	);
};

export { ChangePasswordForm };
