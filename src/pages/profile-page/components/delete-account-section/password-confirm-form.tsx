import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, Input } from "~/libs/components/components";
import { useForm, useFormSubmit, useTranslation } from "~/libs/hooks/hooks";
import {
	deleteAccountWithPassword,
	type DeleteAccountWithPasswordRequestDto,
	deleteAccountWithPasswordValidationSchema,
} from "~/modules/profile/profile";

import styles from "./styles.module.css";

type Properties = {
	onCancel: () => void;
	onDeleted: () => void;
};

const PasswordConfirmForm: React.FC<Properties> = ({ onCancel, onDeleted }) => {
	const { t } = useTranslation();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		setError,
	} = useForm<DeleteAccountWithPasswordRequestDto>({
		defaultValues: { password: "" },
		resolver: zodResolver(deleteAccountWithPasswordValidationSchema),
	});

	const handleFormSubmit = useFormSubmit({
		action: deleteAccountWithPassword,
		onError: () => toast.error(t("profile.deleteAccount.error")),
		onSuccess: onDeleted,
		setError,
	});

	return (
		<form className={styles["form"]} noValidate onSubmit={handleSubmit(handleFormSubmit)}>
			<Input
				error={errors.password?.message && t(errors.password.message)}
				iconLeft="lock"
				label={t("profile.deleteAccount.passwordField.label")}
				placeholder={t("profile.deleteAccount.passwordField.placeholder")}
				required
				type="password"
				{...register("password")}
			/>

			<div className={styles["form__actions"]}>
				<Button onClick={onCancel} size="md" type="button" variant="secondary">
					{t("profile.deleteAccount.cancel")}
				</Button>
				<Button isLoading={isSubmitting} size="md" type="submit" variant="danger">
					{t("profile.deleteAccount.confirm")}
				</Button>
			</div>
		</form>
	);
};

export { PasswordConfirmForm };
