import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { extractFileName } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { AVAILABLE_LANGUAGES, type Language } from "~/libs/modules/localization/localization";

import { updateLevel } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
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

const TEXT_FIELD = "text_audio_url";
const TITLE_FIELD = "title_audio_url";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	level: TrueFalseAdminLevelDto;
};

const buildDefaults = (level: TrueFalseAdminLevelDto): DefaultValues<TextLevelFormInput> => {
	const text: Record<string, string> = {};

	for (const lang of AVAILABLE_LANGUAGES) {
		text[lang] = level.text?.[lang] ?? "";
	}

	return { text: text as Record<Language, string>, title: level.title };
};

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
				audioField={TITLE_FIELD}
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
				audioField={TEXT_FIELD}
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
