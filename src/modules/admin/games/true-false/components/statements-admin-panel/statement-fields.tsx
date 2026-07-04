import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { LocalizedInputGroup } from "~/libs/components/components";
import { useLocalizedLabel } from "~/libs/modules/localization/localization";

import { type StatementFormInput } from "../../libs/validation-schemas/statement.validation-schema";
import { IsTrueToggle } from "./is-true-toggle";
import styles from "./styles.module.css";

type Properties = {
	errors: FieldErrors<StatementFormInput>;
	register: UseFormRegister<StatementFormInput>;
};

/**
 * The localized statement + explanation inputs and the is_true toggle for the
 * create-statement modal. The inline edit form does NOT use this; it composes
 * LocalizedAudioField + IsTrueToggle directly, since each field there also needs
 * per-locale audio controls.
 */
const StatementFields: React.FC<Properties> = ({ errors, register }) => {
	const getStatementLabel = useLocalizedLabel("admin.trueFalse.statement.fields.statement");
	const getExplanationLabel = useLocalizedLabel("admin.trueFalse.statement.fields.explanation");

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

			<IsTrueToggle register={register} />
		</div>
	);
};

export { StatementFields };
