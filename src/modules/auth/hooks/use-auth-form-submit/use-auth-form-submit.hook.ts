import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { t } from "i18next";
import { useCallback } from "react";
import { type FieldValues, type Path, type UseFormSetError } from "react-hook-form";

import { FIRST_INDEX } from "~/libs/constants/constants";
import { isThunkErrorPayload } from "~/libs/helpers/helpers";
import { useAppDispatch } from "~/libs/hooks/hooks";
import { type AsyncThunkConfig } from "~/libs/types/types";
import { actions as authActions } from "~/modules/auth/auth";

type Properties<T extends FieldValues, R> = {
	action: (argument: T) => AsyncThunkAction<R, T, AsyncThunkConfig>;
	onSuccess?: (() => void) | undefined;
	setError: UseFormSetError<T>;
};

const useAuthFormSubmit = <T extends FieldValues, R>({
	action,
	onSuccess,
	setError,
}: Properties<T, R>): ((payload: T) => Promise<void>) => {
	const dispatch = useAppDispatch();

	const handleFormSubmit = useCallback(
		async (payload: T): Promise<void> => {
			dispatch(authActions.clearError());

			const result = await dispatch(action(payload));

			if (result.meta.requestStatus === "rejected") {
				if (isThunkErrorPayload(result.payload) && result.payload.errors) {
					for (const [field, messages] of Object.entries(result.payload.errors)) {
						if (Object.hasOwn(payload, field)) {
							setError(field as Path<T>, {
								message: messages[FIRST_INDEX] ?? t("validation.error"),
							});
						}
					}
				}

				return;
			}

			onSuccess?.();
		},
		[action, dispatch, onSuccess, setError]
	);

	return handleFormSubmit;
};

export { useAuthFormSubmit };
