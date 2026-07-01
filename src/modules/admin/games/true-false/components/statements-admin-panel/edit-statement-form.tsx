import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import {
	useAppDispatch,
	useCallback,
	useForm,
	useId,
	useTranslation,
} from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

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
import styles from "./styles.module.css";

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
 * Inline edit form for a single statement: localized statement + explanation,
 * each with its per-locale audio controls, plus the is_true toggle.
 */
const EditStatementForm: React.FC<Properties> = ({ audio, gameId, onDone, statement }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const isTrueId = useId();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<StatementFormInput, unknown, StatementFormValues>({
		defaultValues: buildDefaults(statement),
		resolver: zodResolver(statementValidationSchema),
	});

	const statementScope = audio.statementScope(statement.id);

	const getStatementLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.statement.fields.statement.${lang}`),
		[t]
	);
	const getExplanationLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.statement.fields.explanation.${lang}`),
		[t]
	);

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

			<label className={styles["statement-fields__toggle"]} htmlFor={isTrueId}>
				<input id={isTrueId} type="checkbox" {...register("is_true")} />
				{t("admin.trueFalse.statement.fields.isTrue")}
			</label>

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
