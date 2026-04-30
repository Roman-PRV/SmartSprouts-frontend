import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { type FieldValues, type UseFormSetError } from "react-hook-form";

import { useAppDispatch, useFormSubmit } from "~/libs/hooks/hooks";
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
	const handleFormSubmit = useFormSubmit({ action, onSuccess, setError });

	return useCallback(
		async (payload: T): Promise<void> => {
			dispatch(authActions.clearError());
			await handleFormSubmit(payload);
		},
		[dispatch, handleFormSubmit],
	);
};

export { useAuthFormSubmit };
