import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/libs/components/components";
import { extractFileName } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useForm, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { useLocalizedLabel } from "~/libs/modules/localization/localization";

import { updateLevel } from "../../api/true-false-admin";
import { type useTrueFalseAudio } from "../../hooks/hooks";
import { AudioField } from "../../libs/enums/enums";
import { buildTrueFalseLevelFormData } from "../../libs/helpers/build-true-false-level-form-data.helper";
import { type TrueFalseAdminLevelDto } from "../../libs/types/types";
import {
	type ImageLevelEditFormInput,
	type ImageLevelEditFormValues,
	imageLevelEditValidationSchema,
	MAX_IMAGE_MEGABYTES,
} from "../../libs/validation-schemas/image-level.validation-schema";
import { LocalizedAudioField } from "../audio-field-controls/localized-audio-field";
import { LevelImageField } from "./level-image-field";
import styles from "./styles.module.css";

type Properties = {
	audio: ReturnType<typeof useTrueFalseAudio>;
	gameId: string;
	level: TrueFalseAdminLevelDto;
};

/**
 * Edit form for an image level: localized title (with per-locale audio
 * controls), optional image replacement, and the current image name.
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

	const getTitleLabel = useLocalizedLabel("admin.trueFalse.level.fields.title");

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

export { ImageLevelEditorForm };
