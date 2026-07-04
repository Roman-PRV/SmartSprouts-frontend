import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues } from "react-hook-form";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { useForm, useTranslation } from "~/libs/hooks/hooks";
import { createEmptyLocalized, useLocalizedLabel } from "~/libs/modules/localization/localization";

import { useLevelSubmit } from "../../hooks/hooks";
import { MAX_IMAGE_MEGABYTES } from "../../libs/validation-schemas/base.validation-schema";
import {
	type ImageLevelFormInput,
	type ImageLevelFormValues,
	imageLevelValidationSchema,
} from "../../libs/validation-schemas/image-level.validation-schema";
import { LevelImageField } from "./level-image-field";
import styles from "./styles.module.css";

const DEFAULT_VALUES: DefaultValues<ImageLevelFormInput> = {
	title: createEmptyLocalized(),
};

type Properties = {
	gameId: string;
	onCancel: () => void;
	onSuccess: (levelId: number) => void;
};

/**
 * Create form for the image game: localized title + a required cover image.
 */
const ImageLevelCreateForm: React.FC<Properties> = ({ gameId, onCancel, onSuccess }) => {
	const { t } = useTranslation();

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<ImageLevelFormInput, unknown, ImageLevelFormValues>({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(imageLevelValidationSchema),
	});

	const getTitleLabel = useLocalizedLabel("admin.trueFalse.level.fields.title");
	const onSubmit = useLevelSubmit<ImageLevelFormValues>({ gameId, onSuccess });

	return (
		<form className={styles["form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
			<LocalizedInputGroup
				errors={errors.title}
				fieldName="title"
				getLabel={getTitleLabel}
				register={register}
				required
			/>
			<LevelImageField
				errorMessage={errors.image?.message}
				maxMegabytes={MAX_IMAGE_MEGABYTES}
				register={register}
				required
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

export { ImageLevelCreateForm };
