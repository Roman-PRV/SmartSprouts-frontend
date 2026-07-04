import { type FieldPath, type FieldValues, type UseFormRegister } from "react-hook-form";

import { useId, useTranslation } from "~/libs/hooks/hooks";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

import styles from "./styles.module.css";

const DEFAULT_ROWS = 4;

type Properties<TFieldValues extends FieldValues> = Readonly<{
	errors: Partial<Record<Language, undefined | { message?: string }>> | undefined;
	fieldName: FieldPath<TFieldValues>;
	getLabel: (lang: Language) => string;
	register: UseFormRegister<TFieldValues>;
	required?: boolean;
}>;

/**
 * Renders one multi-line textarea per supported language for a localized body
 * field. Mirrors LocalizedInputGroup but with a textarea, since level text can
 * be long.
 */
function LocalizedTextareaGroup<TFieldValues extends FieldValues>({
	errors,
	fieldName,
	getLabel,
	register,
	required = false,
}: Properties<TFieldValues>): React.ReactElement {
	const { t } = useTranslation();
	const baseId = useId();

	return (
		<>
			{AVAILABLE_LANGUAGES.map((lang) => {
				const id = `${baseId}-${lang}`;
				const errorId = `${id}-error`;
				const message = errors?.[lang]?.message;

				return (
					<div className={styles["form__field-group"]} key={lang}>
						<label className={styles["form__field-label"]} htmlFor={id}>
							{getLabel(lang)}
							{required && <span className={styles["form__field-required"]}> *</span>}
						</label>
						<textarea
							aria-invalid={Boolean(message)}
							className={styles["form__textarea"]}
							id={id}
							rows={DEFAULT_ROWS}
							{...(message && { "aria-describedby": errorId })}
							{...register(`${fieldName}.${lang}` as FieldPath<TFieldValues>)}
						/>
						{message && (
							<span className={styles["form__field-error"]} id={errorId} role="alert">
								{t(message)}
							</span>
						)}
					</div>
				);
			})}
		</>
	);
}

export { LocalizedTextareaGroup };
