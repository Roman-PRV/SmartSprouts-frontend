import { type UseFormRegister } from "react-hook-form";

import { useId, useTranslation } from "~/libs/hooks/hooks";

import { type StatementFormInput } from "../../libs/validation-schemas/statement.validation-schema";
import styles from "./styles.module.css";

type Properties = {
	register: UseFormRegister<StatementFormInput>;
};

/**
 * The is_true checkbox shared by the create-statement modal (via StatementFields)
 * and the inline edit form, so its markup and label live in one place.
 */
const IsTrueToggle: React.FC<Properties> = ({ register }) => {
	const { t } = useTranslation();
	const id = useId();

	return (
		<label className={styles["statement-fields__toggle"]} htmlFor={id}>
			<input id={id} type="checkbox" {...register("is_true")} />
			{t("admin.trueFalse.statement.fields.isTrue")}
		</label>
	);
};

export { IsTrueToggle };
