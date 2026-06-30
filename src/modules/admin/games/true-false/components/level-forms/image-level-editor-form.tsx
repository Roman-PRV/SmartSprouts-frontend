import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Language } from "~/libs/modules/localization/localization";

import { updateLevel } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
import { buildTrueFalseLevelFormData } from "../../libs/helpers/build-true-false-level-form-data.helper";
import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import {
	type ImageLevelEditFormInput,
	type ImageLevelEditFormValues,
	imageLevelEditValidationSchema,
	MAX_IMAGE_MEGABYTES,
} from "../../libs/validation-schemas/image-level.validation-schema";
import { AudioFieldControls } from "../audio-field-controls/audio-field-controls";
import { LevelImageField } from "./level-image-field";
import styles from "./styles.module.css";

const TITLE_FIELD = "title_audio_url";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	level: TrueFalseAdminLevelDto;
};

/**
 * Edit form for an image level: localized title, optional image replacement,
 * and the per-locale title-audio regenerate controls.
 */
const ImageLevelEditorForm: React.FC<Properties> = ({ audio, gameId, level }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const defaultValues: DefaultValues<ImageLevelEditFormInput> = { title: level.title };

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<ImageLevelEditFormInput, unknown, ImageLevelEditFormValues>({
		defaultValues,
		resolver: zodResolver(imageLevelEditValidationSchema),
	});

	const getTitleLabel = useCallback(
		(lang: Language) => t(`admin.trueFalse.level.fields.title.${lang}`),
		[t]
	);

	const onSubmit = useCallback<SubmitHandler<ImageLevelEditFormValues>>(
		async (values) => {
			try {
				const formData = buildTrueFalseLevelFormData(
					{ image: values.image, title: values.title },
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
			<LocalizedInputGroup
				errors={errors.title}
				fieldName="title"
				getLabel={getTitleLabel}
				register={register}
				required
			/>
			<AudioFieldControls
				audio={audio}
				audioMap={level.title_audio}
				field={TITLE_FIELD}
				label={t("admin.trueFalse.level.audio.title")}
				scope={audio.levelScope}
			/>
			<LevelImageField
				errorMessage={errors.image?.message}
				maxMegabytes={MAX_IMAGE_MEGABYTES}
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

export { ImageLevelEditorForm };
