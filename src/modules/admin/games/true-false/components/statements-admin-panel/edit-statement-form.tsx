import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

import { updateStatement } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
import { type TrueFalseAdminStatementDto } from "../../libs/types/types";
import {
	type StatementFormInput,
	type StatementFormValues,
	statementValidationSchema,
} from "../../libs/validation-schemas/statement.validation-schema";
import { AudioFieldControls } from "../audio-field-controls/audio-field-controls";
import { StatementFields } from "./statement-fields";
import styles from "./styles.module.css";

const EXPLANATION_FIELD = "explanation_audio_url";
const STATEMENT_FIELD = "statement_audio_url";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	onDone: () => void;
	statement: TrueFalseAdminStatementDto;
};

const buildDefaults = (
	statement: TrueFalseAdminStatementDto
): DefaultValues<StatementFormInput> => {
	const explanation: Record<string, string> = {};

	for (const lang of AVAILABLE_LANGUAGES) {
		explanation[lang] = statement.explanation[lang] ?? "";
	}

	return {
		explanation: explanation as Record<Language, string>,
		is_true: statement.is_true,
		statement: statement.statement,
	};
};

/**
 * Inline edit form for a single statement: localized text + is_true plus the
 * per-locale audio regenerate controls for both the statement and explanation.
 */
const EditStatementForm: React.FC<Properties> = ({ audio, gameId, onDone, statement }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<StatementFormInput, unknown, StatementFormValues>({
		defaultValues: buildDefaults(statement),
		resolver: zodResolver(statementValidationSchema),
	});

	const statementScope = audio.statementScope(statement.id);

	const onSubmit = useCallback<SubmitHandler<StatementFormValues>>(
		async (values) => {
			try {
				await dispatch(
					updateStatement({
						gameId,
						payload: {
							explanation: values.explanation,
							is_true: values.is_true,
							statement: values.statement,
						},
						statementId: statement.id,
					})
				).unwrap();

				toast.success(t("admin.trueFalse.statement.edit.success"));
				onDone();
			} catch {
				toast.error(t("admin.trueFalse.statement.edit.error"));
			}
		},
		[dispatch, gameId, onDone, statement.id, t]
	);

	return (
		<form className={styles["statement-form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
			<StatementFields errors={errors} register={register} />

			<AudioFieldControls
				audio={audio}
				audioMap={statement.statement_audio}
				field={STATEMENT_FIELD}
				label={t("admin.trueFalse.statement.audio.statement")}
				scope={statementScope}
			/>
			<AudioFieldControls
				audio={audio}
				audioMap={statement.explanation_audio}
				field={EXPLANATION_FIELD}
				label={t("admin.trueFalse.statement.audio.explanation")}
				scope={statementScope}
			/>

			<div className={styles["statement-form__actions"]}>
				<Button onClick={onDone} type="button" variant="secondary">
					{t("admin.trueFalse.statement.edit.cancel")}
				</Button>
				<Button isLoading={isSubmitting} type="submit" variant="primary">
					{t("admin.trueFalse.statement.edit.submit")}
				</Button>
			</div>
		</form>
	);
};

export { EditStatementForm };
