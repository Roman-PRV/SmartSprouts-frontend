import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { extractFileName } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { createEmptyLocalized, useLocalizedLabel } from "~/libs/modules/localization/localization";

import { updateLevel } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
import { AudioField } from "../../libs/enums/enums";
import { buildTrueFalseLevelFormData } from "../../libs/helpers/build-true-false-level-form-data.helper";
import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import {
	MAX_IMAGE_MEGABYTES,
	type TextLevelFormInput,
	type TextLevelFormValues,
	textLevelValidationSchema,
} from "../../libs/validation-schemas/text-level.validation-schema";
import { LocalizedAudioField } from "../audio-field-controls/localized-audio-field";
import { LevelImageField } from "./level-image-field";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	level: TrueFalseAdminLevelDto;
};

const buildDefaults = (level: TrueFalseAdminLevelDto): DefaultValues<TextLevelFormInput> => ({
	// Start from every locale empty, then overlay the stored values, so missing
	// locales default to "" without hand-listing them.
	text: { ...createEmptyLocalized(), ...level.text },
	title: level.title,
});

/**
 * Edit form for a text level: localized title + body text (each with its own
 * per-locale audio controls), optional image replacement, and the current image
 * name.
 */
const TextLevelEditorForm: React.FC<Properties> = ({ audio, gameId, level }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<TextLevelFormInput, unknown, TextLevelFormValues>({
		defaultValues: buildDefaults(level),
		resolver: zodResolver(textLevelValidationSchema),
	});

	const getTitleLabel = useLocalizedLabel("admin.trueFalse.level.fields.title");
	const getTextLabel = useLocalizedLabel("admin.trueFalse.level.fields.text");

	const onSubmit = useCallback<SubmitHandler<TextLevelFormValues>>(
		async (values) => {
			try {
				const formData = buildTrueFalseLevelFormData(
					{ image: values.image, text: values.text, title: values.title },
					HTTPMethod.PATCH
				);
				await dispatch(updateLevel({ formData, gameId, levelId: level.id })).unwrap();

				toast.success(t("admin.trueFalse.level.edit.success"));
			} catch {
				toast.error(t("admin.trueFalse.level.edit.error"));
			}
		},
		[dispatch, gameId, level.id, t]
	);

	return (
		<form className={styles["form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
			<LocalizedAudioField
				audio={audio}
				audioField={AudioField.TITLE}
				audioMap={level.title_audio}
				errors={errors.title}
				fieldLabel={t("admin.trueFalse.level.audio.title")}
				fieldName="title"
				getLabel={getTitleLabel}
				register={register}
				required
				scope={audio.levelScope}
			/>
			<LocalizedAudioField
				audio={audio}
				audioField={AudioField.TEXT}
				audioMap={level.text_audio}
				errors={errors.text}
				fieldLabel={t("admin.trueFalse.level.audio.text")}
				fieldName="text"
				getLabel={getTextLabel}
				multiline
				register={register}
				required
				scope={audio.levelScope}
			/>
			<LevelImageField
				currentFileName={extractFileName(level.image_url) ?? undefined}
				errorMessage={errors.image?.message}
				maxMegabytes={MAX_IMAGE_MEGABYTES}
				previewUrl={level.image_url}
				register={register}
			/>

			<div className={styles["form__actions"]}>
				<Button isLoading={isSubmitting} type="submit" variant="primary">
					{t("admin.trueFalse.level.edit.submit")}
				</Button>
			</div>
		</form>
	);
};

export { TextLevelEditorForm };
