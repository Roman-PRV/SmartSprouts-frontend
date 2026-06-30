import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button, Modal } from "~/libs/components/components";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";

import { createStatement } from "../../api/true-false-admin";
import {
	type StatementFormInput,
	type StatementFormValues,
	statementValidationSchema,
} from "../../libs/validation-schemas/statement.validation-schema";
import { StatementFields } from "./statement-fields";
import styles from "./styles.module.css";

const DEFAULT_VALUES: DefaultValues<StatementFormInput> = {
	explanation: { en: "", es: "", uk: "" },
	is_true: false,
	statement: { en: "", es: "", uk: "" },
};

type Properties = {
	gameId: string;
	isOpen: boolean;
	levelId: number;
	onClose: () => void;
};

const CreateStatementModal: React.FC<Properties> = ({ gameId, isOpen, levelId, onClose }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		reset,
	} = useForm<StatementFormInput, unknown, StatementFormValues>({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(statementValidationSchema),
	});

	const handleClose = useCallback(() => {
		reset(DEFAULT_VALUES);
		onClose();
	}, [onClose, reset]);

	const onSubmit = useCallback<SubmitHandler<StatementFormValues>>(
		async (values) => {
			try {
				await dispatch(
					createStatement({
						gameId,
						levelId,
						payload: {
							explanation: values.explanation,
							is_true: values.is_true,
							statement: values.statement,
						},
					})
				).unwrap();

				toast.success(t("admin.trueFalse.statement.create.success"));
				handleClose();
			} catch {
				toast.error(t("admin.trueFalse.statement.create.error"));
			}
		},
		[dispatch, gameId, handleClose, levelId, t]
	);

	return (
		<Modal
			closeOnBackdropClick={false}
			isOpen={isOpen}
			onClose={handleClose}
			title={t("admin.trueFalse.statement.create.modalTitle")}
		>
			<form className={styles["statement-form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
				<StatementFields errors={errors} register={register} />

				<div className={styles["statement-form__actions"]}>
					<Button onClick={handleClose} type="button" variant="secondary">
						{t("admin.trueFalse.statement.create.cancel")}
					</Button>
					<Button isLoading={isSubmitting} type="submit" variant="primary">
						{t("admin.trueFalse.statement.create.submit")}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export { CreateStatementModal };
