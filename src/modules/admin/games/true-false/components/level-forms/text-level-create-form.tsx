import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { createEmptyLocalized, type Language } from "~/libs/modules/localization/localization";

import { createLevel } from "../../api/true-false-admin";
import { buildTrueFalseLevelFormData } from "../../libs/helpers/build-true-false-level-form-data.helper";
import {
	MAX_IMAGE_MEGABYTES,
	type TextLevelFormInput,
	type TextLevelFormValues,
	textLevelValidationSchema,
} from "../../libs/validation-schemas/text-level.validation-schema";
import { LevelImageField } from "./level-image-field";
import { LocalizedTextareaGroup } from "./localized-textarea-group";
import styles from "./styles.module.css";

const DEFAULT_VALUES: DefaultValues<TextLevelFormInput> = {
	text: createEmptyLocalized(),
	title: createEmptyLocalized(),
};

type Properties = {
	gameId: string;
	onCancel: () => void;
	onSuccess: (levelId: number) => void;
};

/**
 * Create form for the text game: localized title + body text and an optional
 * cover image.
 */
const TextLevelCreateForm: React.FC<Properties> = ({ gameId, onCancel, onSuccess }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<TextLevelFormInput, unknown, TextLevelFormValues>({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(textLevelValidationSchema),
	});

	const getTitleLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.level.fields.title.${lang}`),
		[t]
	);
	const getTextLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.level.fields.text.${lang}`),
		[t]
	);

	const onSubmit = useCallback<SubmitHandler<TextLevelFormValues>>(
		async (values) => {
			try {
				const formData = buildTrueFalseLevelFormData(
					{ image: values.image, text: values.text, title: values.title },
					HTTPMethod.POST
				);
				const level = await dispatch(createLevel({ formData, gameId })).unwrap();

				toast.success(t("admin.trueFalse.level.create.success"));
				onSuccess(level.id);
			} catch {
				toast.error(t("admin.trueFalse.level.create.error"));
			}
		},
		[dispatch, gameId, onSuccess, t]
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
			<LocalizedInputGroup
				errors={errors.title}
				fieldName="title"
				getLabel={getTitleLabel}
				register={register}
				required
			/>
			<LocalizedTextareaGroup
				errors={errors.text}
				fieldName="text"
				getLabel={getTextLabel}
				register={register}
				required
			/>
			<LevelImageField
				errorMessage={errors.image?.message}
				maxMegabytes={MAX_IMAGE_MEGABYTES}
				register={register}
			/>

			<div className={styles["form__actions"]}>
				<Button onClick={onCancel} type="button" variant="secondary">
					{t("admin.trueFalse.level.create.cancel")}
				</Button>
				<Button isLoading={isSubmitting} type="submit" variant="primary">
					{t("admin.trueFalse.level.create.submit")}
				</Button>
			</div>
		</form>
	);
};

export { TextLevelCreateForm };
