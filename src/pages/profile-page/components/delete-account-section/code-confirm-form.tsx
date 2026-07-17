import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, Input } from "~/libs/components/components";
import {
	useAppDispatch,
	useCallback,
	useForm,
	useFormSubmit,
	useState,
	useTranslation,
} from "~/libs/hooks/hooks";
import {
	deleteAccountWithCode,
	type DeleteAccountWithCodeRequestDto,
	deleteAccountWithCodeValidationSchema,
	requestDeletionCode,
} from "~/modules/profile/profile";

import styles from "./styles.module.css";

type Properties = {
	onCancel: () => void;
	onDeleted: () => void;
};

const CodeConfirmForm: React.FC<Properties> = ({ onCancel, onDeleted }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
	const [isSendingCode, setIsSendingCode] = useState<boolean>(false);

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		setError,
	} = useForm<DeleteAccountWithCodeRequestDto>({
		defaultValues: { code: "" },
		resolver: zodResolver(deleteAccountWithCodeValidationSchema),
	});

	const handleSendCode = useCallback(async (): Promise<void> => {
		setIsSendingCode(true);

		try {
			await dispatch(requestDeletionCode()).unwrap();
			setIsCodeSent(true);
			toast.success(t("profile.deleteAccount.codeSent"));
		} catch {
			toast.error(t("profile.deleteAccount.codeSendError"));
		} finally {
			setIsSendingCode(false);
		}
	}, [dispatch, t]);

	const handleSendCodeClick = useCallback((): void => {
		void handleSendCode();
	}, [handleSendCode]);

	const handleFormSubmit = useFormSubmit({
		action: deleteAccountWithCode,
		onError: () => toast.error(t("profile.deleteAccount.error")),
		onSuccess: onDeleted,
		setError,
	});

	return (
		<div className={styles["form"]}>
			<p className={styles["hint"]}>{t("profile.deleteAccount.codeHint")}</p>

			<Button
				isLoading={isSendingCode}
				onClick={handleSendCodeClick}
				size="md"
				type="button"
				variant="secondary"
			>
				{isCodeSent ? t("profile.deleteAccount.resend") : t("profile.deleteAccount.sendCode")}
			</Button>

			{isCodeSent && (
				<form className={styles["form"]} noValidate onSubmit={handleSubmit(handleFormSubmit)}>
					<Input
						error={errors.code?.message && t(errors.code.message)}
						label={t("profile.deleteAccount.codeField.label")}
						placeholder={t("profile.deleteAccount.codeField.placeholder")}
						required
						type="text"
						{...register("code")}
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
			)}

			{!isCodeSent && (
				<div className={styles["form__actions"]}>
					<Button onClick={onCancel} size="md" type="button" variant="secondary">
						{t("profile.deleteAccount.cancel")}
					</Button>
				</div>
			)}
		</div>
	);
};

export { CodeConfirmForm };
