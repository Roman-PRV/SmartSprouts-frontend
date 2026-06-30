import { type FieldPath, type FieldValues, type UseFormRegister } from "react-hook-form";

import { useId, useTranslation } from "~/libs/hooks/hooks";
import { ALLOWED_IMAGE_TYPES } from "~/libs/validation-schemas/image-file.schema";

import styles from "./styles.module.css";

const ACCEPTED_IMAGE_TYPES = ALLOWED_IMAGE_TYPES.join(",");

type Properties<TFieldValues extends FieldValues> = Readonly<{
	errorMessage: string | undefined;
	maxMegabytes: number;
	register: UseFormRegister<TFieldValues>;
	required?: boolean;
}>;

/**
 * The cover-image file input shared by every true/false level form. Image is
 * required when creating an image level and optional otherwise. All level form
 * schemas expose an `image` field, so the generic register stays type-safe.
 */
function LevelImageField<TFieldValues extends FieldValues>({
	errorMessage,
	maxMegabytes,
	register,
	required = false,
}: Properties<TFieldValues>): React.ReactElement {
	const { t } = useTranslation();
	const inputId = useId();
	const hintId = `${inputId}-hint`;
	const errorId = `${inputId}-error`;
	const describedBy = [hintId, errorMessage ? errorId : null].filter(Boolean).join(" ");

	return (
		<div className={styles["form__field-group"]}>
			<label className={styles["form__field-label"]} htmlFor={inputId}>
				{t("admin.trueFalse.level.fields.image.label")}
				{required && <span className={styles["form__field-required"]}> *</span>}
			</label>
			<input
				accept={ACCEPTED_IMAGE_TYPES}
				aria-describedby={describedBy}
				aria-invalid={Boolean(errorMessage)}
				className={styles["form__file-input"]}
				id={inputId}
				type="file"
				{...register("image" as FieldPath<TFieldValues>)}
			/>
			<span className={styles["form__field-hint"]} id={hintId}>
				{t("admin.trueFalse.level.fields.image.hint", { maxMb: maxMegabytes })}
			</span>
			{errorMessage && (
				<span className={styles["form__field-error"]} id={errorId} role="alert">
					{t(errorMessage, { maxMb: maxMegabytes })}
				</span>
			)}
		</div>
	);
}

export { LevelImageField };
