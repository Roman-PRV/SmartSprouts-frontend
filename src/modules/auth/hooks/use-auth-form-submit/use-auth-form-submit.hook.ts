import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { type FieldValues, type Path, type UseFormSetError } from "react-hook-form";

import { FIRST_INDEX } from "~/libs/constants/constants";
import { useAppDispatch } from "~/libs/hooks/hooks";
import { type AsyncThunkConfig, type ThunkErrorPayload } from "~/libs/types/types";
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
				const errorPayload = result.payload as ThunkErrorPayload | undefined;

				if (errorPayload?.errors) {
					for (const [field, messages] of Object.entries(errorPayload.errors)) {
						if (Object.hasOwn(payload, field)) {
							setError(field as Path<T>, {
								message: messages[FIRST_INDEX] ?? "Validation error",
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
