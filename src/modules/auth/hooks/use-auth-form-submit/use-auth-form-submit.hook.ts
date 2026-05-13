import { type AsyncThunkAction } from "@reduxjs/toolkit";
import { type FieldValues, type UseFormSetError } from "react-hook-form";

import { useFormSubmit } from "~/libs/hooks/hooks";
import { type AsyncThunkConfig } from "~/libs/types/types";

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
	return useFormSubmit({ action, onSuccess, setError });
};

export { useAuthFormSubmit };
