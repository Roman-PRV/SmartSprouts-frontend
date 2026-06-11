import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { extractFileName } from "~/libs/helpers/helpers";
import { useCallback, useForm, useId, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Language } from "~/libs/modules/localization/localization";

import { buildLevelFormData } from "../../libs/helpers/build-level-form-data.helper";
import { type FindTheWrongAdminLevelDto } from "../../libs/types/types";
import {
	ALLOWED_IMAGE_TYPES,
	MAX_IMAGE_MEGABYTES,
	MAX_TITLE_LENGTH,
} from "../../libs/validation-schemas/create-level.validation-schema";
import {
	type UpdateLevelFormInput,
	type UpdateLevelFormValues,
	updateLevelValidationSchema,
} from "../../libs/validation-schemas/update-level.validation-schema";
import styles from "./styles.module.css";

const ACCEPTED_IMAGE_TYPES = ALLOWED_IMAGE_TYPES.join(",");

const buildDefaultValues = (
	level: FindTheWrongAdminLevelDto
): DefaultValues<UpdateLevelFormInput> => ({
	title: level.title,
});

type Properties = {
	isPending: boolean;
	level: FindTheWrongAdminLevelDto;
	onSubmit: (formData: FormData) => Promise<void>;
};

const TitleForm: React.FC<Properties> = ({ isPending, level, onSubmit }) => {
	const { t } = useTranslation();
	const imageInputId = useId();
	const imageHintId = `${imageInputId}-hint`;
	const imageErrorId = `${imageInputId}-error`;

	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<UpdateLevelFormInput, unknown, UpdateLevelFormValues>({
		defaultValues: buildDefaultValues(level),
		resolver: zodResolver(updateLevelValidationSchema),
	});

	const handleFormSubmit = useCallback<SubmitHandler<UpdateLevelFormValues>>(
		async (values) => {
			const formData = buildLevelFormData(
				{
					...(values.image && { image: values.image }),
					title: values.title,
				},
				HTTPMethod.PATCH
			);

			try {
				await onSubmit(formData);
			} catch {
				// Hook already surfaced the error via toast; form stays populated for retry.
			}
		},
		[onSubmit]
	);

	const getTitleLabel = useCallback(
		(lang: Language) => t(`admin.findTheWrong.create.fields.title.${lang}.label`),
		[t]
	);

	const getTitlePlaceholder = useCallback(
		(lang: Language) => t(`admin.findTheWrong.create.fields.title.${lang}.placeholder`),
		[t]
	);

	const imageError = errors.image?.message;
	const currentFileName = extractFileName(level.image_url);
	const describedBy = [imageHintId, imageError ? imageErrorId : null]
		.filter(Boolean)
		.join(" ");

	return (
		<form
			className={styles["title-form"]}
			noValidate
			onSubmit={handleSubmit(handleFormSubmit)}
		>
			<LocalizedInputGroup
				errorInterpolation={{ max: MAX_TITLE_LENGTH }}
				errors={errors.title}
				fieldName="title"
				getLabel={getTitleLabel}
				getPlaceholder={getTitlePlaceholder}
				register={register}
				required
				size="sm"
			/>

			<div className={styles["title-form__field-group"]}>
				<label className={styles["title-form__field-label"]} htmlFor={imageInputId}>
					{t("admin.findTheWrong.editor.fields.image.label")}
				</label>
				<input
					accept={ACCEPTED_IMAGE_TYPES}
					aria-describedby={describedBy}
					aria-invalid={Boolean(imageError)}
					className={styles["title-form__file-input"]}
					id={imageInputId}
					type="file"
					{...register("image")}
				/>
				{currentFileName && (
					<span className={styles["title-form__field-hint"]}>
						{t("admin.findTheWrong.editor.fields.image.currentFile", {
							name: currentFileName,
						})}
					</span>
				)}
				<span className={styles["title-form__field-hint"]} id={imageHintId}>
					{t("admin.findTheWrong.editor.fields.image.hint", { maxMb: MAX_IMAGE_MEGABYTES })}
				</span>
				{imageError && (
					<span
						className={styles["title-form__field-error"]}
						id={imageErrorId}
						role="alert"
					>
						{t(imageError, { maxMb: MAX_IMAGE_MEGABYTES })}
					</span>
				)}
			</div>

			<div className={styles["title-form__actions"]}>
				<Button isLoading={isPending} size="sm" type="submit" variant="primary">
					{t("admin.findTheWrong.editor.saveLevel")}
				</Button>
			</div>
		</form>
	);
};

export { TitleForm };
