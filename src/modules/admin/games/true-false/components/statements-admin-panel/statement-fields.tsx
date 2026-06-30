import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { LocalizedInputGroup } from "~/libs/components/components";
import { useCallback, useId, useTranslation } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";

import { type StatementFormInput } from "../../libs/validation-schemas/statement.validation-schema";
import styles from "./styles.module.css";

type Properties = {
	errors: FieldErrors<StatementFormInput>;
	register: UseFormRegister<StatementFormInput>;
};

/**
 * The localized statement + explanation inputs and the is_true toggle, shared
 * by the create-statement modal and the inline edit form.
 */
const StatementFields: React.FC<Properties> = ({ errors, register }) => {
	const { t } = useTranslation();
	const isTrueId = useId();

	const getStatementLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.statement.fields.statement.${lang}`),
		[t]
	);
	const getExplanationLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.statement.fields.explanation.${lang}`),
		[t]
	);

	return (
		<div className={styles["statement-fields"]}>
			<LocalizedInputGroup
				errors={errors.statement}
				fieldName="statement"
				getLabel={getStatementLabel}
				register={register}
				required
			/>

			<LocalizedInputGroup
				errors={errors.explanation}
				fieldName="explanation"
				getLabel={getExplanationLabel}
				register={register}
			/>

			<label className={styles["statement-fields__toggle"]} htmlFor={isTrueId}>
				<input id={isTrueId} type="checkbox" {...register("is_true")} />
				{t("admin.trueFalse.statement.fields.isTrue")}
			</label>
		</div>
	);
};

export { StatementFields };
