import { toast } from "sonner";

import { toastError } from "~/libs/helpers/helpers";
import { useAppDispatch, useCallback, useTranslation } from "~/libs/hooks/hooks";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";

import { createLevel, updateLevel } from "../../api/true-false-admin";
import {
	buildTrueFalseLevelFormData,
	type LevelFormInput,
} from "../../libs/helpers/build-true-false-level-form-data.helper";

type UseLevelSubmitOptions = {
	gameId: string;
	/** Present → edit (PATCH via updateLevel); absent → create (POST). */
	levelId?: number;
	onSuccess?: (levelId: number) => void;
};

/**
 * Shared submit handler for the true/false level create and edit forms: builds
 * the multipart payload, dispatches create/update, and reports success/error via
 * toast. Centralizes the try/catch + toast policy the four forms used to copy.
 */
const useLevelSubmit = <TValues extends LevelFormInput>({
	gameId,
	levelId,
	onSuccess,
}: UseLevelSubmitOptions): ((values: TValues) => Promise<void>) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();

	return useCallback(
		async (values: TValues): Promise<void> => {
			const isCreate = levelId === undefined;

			try {
				const formData = buildTrueFalseLevelFormData(
					values,
					isCreate ? HTTPMethod.POST : HTTPMethod.PATCH
				);
				const level =
					levelId === undefined
						? await dispatch(createLevel({ formData, gameId })).unwrap()
						: await dispatch(updateLevel({ formData, gameId, levelId })).unwrap();

				toast.success(
					t(
						isCreate ? "admin.trueFalse.level.create.success" : "admin.trueFalse.level.edit.success"
					)
				);
				onSuccess?.(level.id);
			} catch (error) {
				toastError(error, 
					t(isCreate ? "admin.trueFalse.level.create.error" : "admin.trueFalse.level.edit.error")
				);
			}
		},
		[dispatch, gameId, levelId, onSuccess, t]
	);
};

export { useLevelSubmit };
