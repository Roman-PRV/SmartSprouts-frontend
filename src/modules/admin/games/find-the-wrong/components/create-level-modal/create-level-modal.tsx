import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { Button, LocalizedInputGroup, Modal } from "~/libs/components/components";
import { toastError } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useCallback,
	useForm,
	useId,
	useNavigate,
	useTranslation,
} from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Language, useLocalizedLabel } from "~/libs/modules/localization/localization";
import { type GameDescriptionDto } from "~/libs/types/types";
import { buildAdminEditorUrl } from "~/modules/admin/libs/helpers/build-admin-editor-url.helper";

import { createLevel } from "../../api/find-the-wrong-admin";
import { TITLE_PLACEHOLDER_EXAMPLES } from "../../libs/constants/title-placeholder-examples.constant";
import { buildLevelFormData } from "../../libs/helpers/build-level-form-data.helper";
import {
	ALLOWED_IMAGE_TYPES,
	type CreateLevelFormInput,
	type CreateLevelFormValues,
	createLevelValidationSchema,
	MAX_IMAGE_MEGABYTES,
	MAX_TITLE_LENGTH,
} from "../../libs/validation-schemas/create-level.validation-schema";
import styles from "./styles.module.css";

const ACCEPTED_IMAGE_TYPES = ALLOWED_IMAGE_TYPES.join(",");

const DEFAULT_VALUES: DefaultValues<CreateLevelFormInput> = {
	title: { en: "", es: "", uk: "" },
};

type Properties = {
	game: GameDescriptionDto;
	isOpen: boolean;
	onClose: () => void;
};

const CreateLevelModal: React.FC<Properties> = ({ game, isOpen, onClose }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const imageInputId = useId();
	const imageHintId = `${imageInputId}-hint`;
	const imageErrorId = `${imageInputId}-error`;

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
		reset,
	} = useForm<CreateLevelFormInput, unknown, CreateLevelFormValues>({
		defaultValues: DEFAULT_VALUES,
		resolver: zodResolver(createLevelValidationSchema),
	});

	const handleClose = useCallback(() => {
		reset(DEFAULT_VALUES);
		onClose();
	}, [onClose, reset]);

	const onSubmit = useCallback<SubmitHandler<CreateLevelFormValues>>(
		async (values) => {
			try {
				const formData = buildLevelFormData(
					{ image: values.image, title: values.title },
					HTTPMethod.POST
				);
				const level = await dispatch(createLevel({ formData, gameId: game.id })).unwrap();

				toast.success(t("admin.findTheWrong.create.success"));
				handleClose();
				void navigate(buildAdminEditorUrl(game.id, level.id));
			} catch (error) {
				toastError(error, t("admin.findTheWrong.create.error"));
			}
		},
		[dispatch, game.id, handleClose, navigate, t]
	);

	const getTitleLabel = useLocalizedLabel("admin.findTheWrong.create.fields.title");

	const getTitlePlaceholder = useCallback(
		(lang: Language): string => TITLE_PLACEHOLDER_EXAMPLES[lang],
		[]
	);

	const imageError = errors.image?.message;
	const describedBy = [imageHintId, imageError ? imageErrorId : null].filter(Boolean).join(" ");

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title={t("admin.findTheWrong.create.modalTitle")}>
			<form className={styles["form"]} noValidate onSubmit={handleSubmit(onSubmit)}>
				<LocalizedInputGroup
					errorInterpolation={{ max: MAX_TITLE_LENGTH }}
					errors={errors.title}
					fieldName="title"
					getLabel={getTitleLabel}
					getPlaceholder={getTitlePlaceholder}
					register={register}
					required
				/>

				<div className={styles["form__field-group"]}>
					<label className={styles["form__field-label"]} htmlFor={imageInputId}>
						{t("admin.findTheWrong.create.fields.image.label")}
						<span className={styles["form__field-required"]}> *</span>
					</label>
					<input
						accept={ACCEPTED_IMAGE_TYPES}
						aria-describedby={describedBy}
						aria-invalid={Boolean(imageError)}
						className={styles["form__file-input"]}
						id={imageInputId}
						type="file"
						{...register("image")}
					/>
					<span className={styles["form__field-hint"]} id={imageHintId}>
						{t("admin.findTheWrong.create.fields.image.hint", { maxMb: MAX_IMAGE_MEGABYTES })}
					</span>
					{imageError && (
						<span className={styles["form__field-error"]} id={imageErrorId} role="alert">
							{t(imageError, { maxMb: MAX_IMAGE_MEGABYTES })}
						</span>
					)}
				</div>

				<div className={styles["form__actions"]}>
					<Button onClick={handleClose} type="button" variant="secondary">
						{t("admin.findTheWrong.create.cancel")}
					</Button>
					<Button isLoading={isSubmitting} type="submit" variant="primary">
						{t("admin.findTheWrong.create.submit")}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export { CreateLevelModal };
