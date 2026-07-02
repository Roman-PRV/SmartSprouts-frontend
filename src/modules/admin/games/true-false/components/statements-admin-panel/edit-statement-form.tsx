import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { createEmptyLocalized, useLocalizedLabel } from "~/libs/modules/localization/localization";

import { updateStatement } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
import { AudioField } from "../../libs/enums/enums";
import { type TrueFalseAdminStatementDto } from "../../libs/types/types";
import {
	type StatementFormInput,
	type StatementFormValues,
	statementValidationSchema,
} from "../../libs/validation-schemas/statement.validation-schema";
import { LocalizedAudioField } from "../audio-field-controls/localized-audio-field";
import { IsTrueToggle } from "./is-true-toggle";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	onDone: () => void;
	statement: TrueFalseAdminStatementDto;
};

const buildDefaults = (
	statement: TrueFalseAdminStatementDto
): DefaultValues<StatementFormInput> => ({
	// Empty every locale first, then overlay the stored explanation.
	explanation: { ...createEmptyLocalized(), ...statement.explanation },
	is_true: statement.is_true,
	statement: statement.statement,
});

/**
 * Inline edit form for a single statement: localized statement + explanation,
 * each with its per-locale audio controls, plus the is_true toggle.
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

	const getStatementLabel = useLocalizedLabel("admin.trueFalse.statement.fields.statement");
	const getExplanationLabel = useLocalizedLabel("admin.trueFalse.statement.fields.explanation");

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
			<LocalizedAudioField
				audio={audio}
				audioField={AudioField.STATEMENT}
				audioMap={statement.statement_audio}
				errors={errors.statement}
				fieldLabel={t("admin.trueFalse.statement.audio.statement")}
				fieldName="statement"
				getLabel={getStatementLabel}
				register={register}
				required
				scope={statementScope}
			/>
			<LocalizedAudioField
				audio={audio}
				audioField={AudioField.EXPLANATION}
				audioMap={statement.explanation_audio}
				errors={errors.explanation}
				fieldLabel={t("admin.trueFalse.statement.audio.explanation")}
				fieldName="explanation"
				getLabel={getExplanationLabel}
				register={register}
				scope={statementScope}
			/>

			<IsTrueToggle register={register} />

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
