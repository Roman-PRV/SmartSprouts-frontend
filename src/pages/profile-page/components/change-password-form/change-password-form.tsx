import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, Input } from "~/libs/components/components";
import { VALIDATION_RULES } from "~/libs/constants/constants";
import { useForm, useFormSubmit, useTranslation } from "~/libs/hooks/hooks";
import {
	updatePassword,
	type UpdatePasswordRequestDto,
	updatePasswordValidationSchema,
} from "~/modules/profile/profile";

import styles from "./styles.module.css";

const ChangePasswordForm: React.FC = () => {
	const { t } = useTranslation();

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

	const handleFormSubmit = useFormSubmit({
		action: updatePassword,
		onError: () => toast.error(t("profile.changePassword.error")),
		onSuccess: () => {
			reset();
			toast.success(t("profile.changePassword.success"));
		},
		setError,
	});

	return (
		<div className={styles["card"]}>
			<h2 className={styles["card__title"]}>{t("profile.changePassword.title")}</h2>
			<form className={styles["form"]} noValidate onSubmit={handleSubmit(handleFormSubmit)}>
				<Input
					error={errors.current_password?.message && t(errors.current_password.message)}
					iconLeft="lock"
					label={t("profile.changePassword.fields.currentPassword.label")}
					placeholder={t("profile.changePassword.fields.currentPassword.placeholder")}
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
					label={t("profile.changePassword.fields.newPassword.label")}
					placeholder={t("profile.changePassword.fields.newPassword.placeholder")}
					required
					type="password"
					{...register("new_password")}
				/>

				<Input
					error={
						errors.new_password_confirmation?.message && t(errors.new_password_confirmation.message)
					}
					iconLeft="lock"
					label={t("profile.changePassword.fields.confirmPassword.label")}
					placeholder={t("profile.changePassword.fields.confirmPassword.placeholder")}
					required
					type="password"
					{...register("new_password_confirmation")}
				/>

				<Button fullWidth isLoading={isSubmitting} size="md" type="submit" variant="primary">
					{t("profile.changePassword.button")}
				</Button>
			</form>
		</div>
	);
};

export { ChangePasswordForm };
