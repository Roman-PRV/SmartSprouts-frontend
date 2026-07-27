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

/** Maps server field errors onto the form; returns whether any field was set. */
const applyFieldErrors = <T extends FieldValues>(
	errors: Record<string, string[]>,
	values: T,
	setError: UseFormSetError<T>
): boolean => {
	let applied = false;

	for (const [field, messages] of Object.entries(errors)) {
		if (Object.hasOwn(values, field)) {
			setError(field as Path<T>, { message: messages[FIRST_INDEX] ?? "validation.error" });
			applied = true;
		}
	}

	return applied;
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

			if (result.meta.requestStatus !== "rejected") {
				onSuccess?.();

				return;
			}

			if (!isThunkErrorPayload(result.payload)) {
				onError?.();

				return;
			}

			// The session expired (authenticated 401); the global handler resets
			// auth and redirects to login, so skip the misleading per-form error.
			if (result.payload.sessionExpired) {
				return;
			}

			const hasFieldErrors = result.payload.errors
				? applyFieldErrors(result.payload.errors, payload, setError)
				: false;

			if (!hasFieldErrors) {
				onError?.();
			}
		},
		[action, dispatch, onError, onSuccess, setError]
	);

	return handleFormSubmit;
};

export { useFormSubmit };
