import { zodResolver } from "@hookform/resolvers/zod";
import { type DefaultValues, type SubmitHandler } from "react-hook-form";

import { Button, LocalizedInputGroup } from "~/libs/components/components";
import { useCallback, useForm, useState, useTranslation } from "~/libs/hooks/hooks";
import { type Language } from "~/libs/modules/localization/localization";

import { sanitizeExplanation } from "../../libs/helpers/sanitize-explanation.helper";
import {
	type FindTheWrongAdminItemDto,
	type UpdateFindTheWrongAdminItemPayload,
} from "../../libs/types/types";
import {
	type EditItemFormInput,
	type EditItemFormValues,
	editItemValidationSchema,
	MAX_EXPLANATION_LENGTH,
	MAX_NAME_LENGTH,
} from "../../libs/validation-schemas/create-item.validation-schema";
import styles from "./styles.module.css";

const buildDefaultValues = (item: FindTheWrongAdminItemDto): DefaultValues<EditItemFormInput> => ({
	explanation: {
		en: item.explanation?.en ?? "",
		es: item.explanation?.es ?? "",
		uk: item.explanation?.uk ?? "",
	},
	name: item.name,
});

type Properties = {
	item: FindTheWrongAdminItemDto;
	onSubmit: (payload: UpdateFindTheWrongAdminItemPayload) => Promise<void>;
};

const ItemEditForm: React.FC<Properties> = ({ item, onSubmit }) => {
	const { t } = useTranslation();
	const [isPending, setIsPending] = useState(false);

	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<EditItemFormInput, unknown, EditItemFormValues>({
		defaultValues: buildDefaultValues(item),
		resolver: zodResolver(editItemValidationSchema),
	});

	const handleFormSubmit = useCallback<SubmitHandler<EditItemFormValues>>(
		async (values) => {
			setIsPending(true);

			try {
				const explanation = sanitizeExplanation(values.explanation);

				await onSubmit({
					...(explanation ? { explanation } : {}),
					name: values.name,
				});
			} catch {
				// Hook already surfaced the error via toast; form stays open for retry.
			} finally {
				setIsPending(false);
			}
		},
		[onSubmit]
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
		<form className={styles["item-form"]} noValidate onSubmit={handleSubmit(handleFormSubmit)}>
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
			<div className={styles["item-form__actions"]}>
				<Button isLoading={isPending} size="sm" type="submit" variant="primary">
					{t("admin.findTheWrong.item.actions.save")}
				</Button>
			</div>
		</form>
	);
};

export { ItemEditForm };
