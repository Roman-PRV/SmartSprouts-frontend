import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues } from "react-hook-form";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { useForm, useTranslation } from "~/libs/hooks/hooks";
import { createEmptyLocalized, useLocalizedLabel } from "~/libs/modules/localization/localization";

import { useLevelSubmit } from "../../hooks/hooks";
import { MAX_IMAGE_MEGABYTES } from "../../libs/validation-schemas/base.validation-schema";
import {
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

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<TextLevelFormInput, unknown, TextLevelFormValues>({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(textLevelValidationSchema),
	});

	const getTitleLabel = useLocalizedLabel("admin.trueFalse.level.fields.title");
	const getTextLabel = useLocalizedLabel("admin.trueFalse.level.fields.text");
	const onSubmit = useLevelSubmit<TextLevelFormValues>({ gameId, onSuccess });

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
