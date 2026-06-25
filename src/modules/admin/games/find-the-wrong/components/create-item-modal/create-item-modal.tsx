import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";

import { Button, LocalizedInputGroup, Modal } from "~/libs/components/components";
import { useCallback, useForm, useMemo, useState, useTranslation } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";
import { type Point } from "~/libs/types/types";

import { sanitizeExplanation } from "../../libs/helpers/sanitize-explanation.helper";
import { type CreateFindTheWrongAdminItemPayload } from "../../libs/types/types";
import {
	type CreateItemFormInput,
	type CreateItemFormValues,
	createItemValidationSchema,
	MAX_EXPLANATION_LENGTH,
	MAX_NAME_LENGTH,
} from "../../libs/validation-schemas/create-item.validation-schema";
import styles from "./styles.module.css";

const buildDefaultValues = (polygon: Point[]): DefaultValues<CreateItemFormInput> => ({
	explanation: { en: "", es: "", uk: "" },
	name: { en: "", es: "", uk: "" },
	polygon,
});

type Properties = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (payload: CreateFindTheWrongAdminItemPayload) => Promise<void>;
	polygon: Point[];
};

const CreateItemModal: React.FC<Properties> = ({ isOpen, onClose, onSubmit, polygon }) => {
	const { t } = useTranslation();
	const [isPending, setIsPending] = useState(false);

	const defaultValues = useMemo(() => buildDefaultValues(polygon), [polygon]);
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset,
	} = useForm<CreateItemFormInput, unknown, CreateItemFormValues>({
		defaultValues,
		resolver: zodResolver(createItemValidationSchema),
	});

	const handleClose = useCallback(() => {
		reset(defaultValues);
		onClose();
	}, [defaultValues, onClose, reset]);

	const handleFormSubmit = useCallback<SubmitHandler<CreateItemFormValues>>(
		async (values) => {
			setIsPending(true);

			try {
				const explanation = sanitizeExplanation(values.explanation);

				await onSubmit({
					...(explanation ? { explanation } : {}),
					name: values.name,
					polygon: values.polygon,
				});

				handleClose();
			} catch {
				// Hook already surfaced the error via toast; modal stays open for retry.
			} finally {
				setIsPending(false);
			}
		},
		[handleClose, onSubmit]
	);

	const getNameLabel = useCallback(
		(lang: Language) => t(`admin.findTheWrong.item.fields.name.${lang}.label`),
		[t]
	);

	const getExplanationLabel = useCallback(
		(lang: Language) => t(`admin.findTheWrong.item.fields.explanation.${lang}.label`),
		[t]
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={handleClose}
			title={t("admin.findTheWrong.item.create.modalTitle")}
		>
			<form className={styles["form"]} noValidate onSubmit={handleSubmit(handleFormSubmit)}>
				<LocalizedInputGroup
					errorInterpolation={{ max: MAX_NAME_LENGTH }}
					errors={errors.name}
					fieldName="name"
					getLabel={getNameLabel}
					register={register}
					required
					size="sm"
				/>
				<LocalizedInputGroup
					errorInterpolation={{ max: MAX_EXPLANATION_LENGTH }}
					errors={errors.explanation}
					fieldName="explanation"
					getLabel={getExplanationLabel}
					register={register}
					size="sm"
				/>

				<div className={styles["form__actions"]}>
					<Button
						disabled={isPending}
						onClick={handleClose}
						size="sm"
						type="button"
						variant="secondary"
					>
						{t("admin.findTheWrong.item.create.cancel")}
					</Button>
					<Button isLoading={isPending} size="sm" type="submit" variant="primary">
						{t("admin.findTheWrong.item.create.submit")}
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export { CreateItemModal };
