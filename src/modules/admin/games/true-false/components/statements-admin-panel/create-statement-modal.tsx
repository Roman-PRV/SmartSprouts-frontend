import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues } from "react-hook-form";

import { Button, Modal } from "~/libs/components/components";
import { useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { createEmptyLocalized } from "~/libs/modules/localization/localization";

import { useStatementSubmit } from "../../hooks/hooks";
import {
	type StatementFormInput,
	type StatementFormValues,
	statementValidationSchema,
} from "../../libs/validation-schemas/statement.validation-schema";
import { StatementFields } from "./statement-fields";
import styles from "./styles.module.css";

const DEFAULT_VALUES: DefaultValues<StatementFormInput> = {
	explanation: createEmptyLocalized(),
	is_true: false,
	statement: createEmptyLocalized(),
};

type Properties = {
	gameId: string;
	isOpen: boolean;
	levelId: number;
	onClose: () => void;
};

const CreateStatementModal: React.FC<Properties> = ({ gameId, isOpen, levelId, onClose }) => {
	const { t } = useTranslation();

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

	const onSubmit = useStatementSubmit({ gameId, levelId, onSuccess: handleClose });

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
