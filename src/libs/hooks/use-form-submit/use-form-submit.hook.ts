import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { type FieldValues, type Path, type UseFormSetError } from "react-hook-form";

import { FIRST_INDEX } from "~/libs/constants/constants";
import { isThunkErrorPayload } from "~/libs/helpers/helpers";
import { useAppDispatch } from "~/libs/hooks/use-app-dispatch/use-app-dispatch.hook";
import { type AsyncThunkConfig } from "~/libs/types/types";

type Properties<T extends FieldValues, R> = {
	action: (argument: T) => AsyncThunkAction<R, T, AsyncThunkConfig>;
	onError?: (() => void) | undefined;
	onSuccess?: (() => void) | undefined;
	setError: UseFormSetError<T>;
};

const useFormSubmit = <T extends FieldValues, R>({
	action,
	onError,
	onSuccess,
	setError,
}: Properties<T, R>): ((payload: T) => Promise<void>) => {
	const dispatch = useAppDispatch();

	const handleFormSubmit = useCallback(
		async (payload: T): Promise<void> => {
			const result = await dispatch(action(payload));

			if (result.meta.requestStatus === "rejected") {
				let hasFieldErrors = false;

				if (isThunkErrorPayload(result.payload) && result.payload.errors) {
					for (const [field, messages] of Object.entries(result.payload.errors)) {
						if (Object.hasOwn(payload, field)) {
							setError(field as Path<T>, {
								message: messages[FIRST_INDEX] ?? "validation.error",
							});
							hasFieldErrors = true;
						}
					}
				}

				if (!hasFieldErrors) {
					onError?.();
				}

				return;
			}

			onSuccess?.();
		},
		[action, dispatch, onError, onSuccess, setError]
	);

	return handleFormSubmit;
};

export { useFormSubmit };
