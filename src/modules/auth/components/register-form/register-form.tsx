import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { Button, Input } from "~/libs/components/components";
import { FIRST_INDEX } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector } from "~/libs/hooks/hooks";
import { type ThunkErrorPayload } from "~/libs/types/types";
import {
	actions as authActions,
	register as registerAction,
	type RegisterRequestDto,
	registerSchema,
} from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

const RegisterForm: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus, error } = useAppSelector((state) => state.auth);

	const {
		formState: { errors },
		handleSubmit,
		register,
		setError,
	} = useForm<RegisterRequestDto>({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			password_confirmation: "",
		},
		resolver: zodResolver(registerSchema),
	});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleFormSubmit = useCallback(
		(payload: RegisterRequestDto): void => {
			const executeSubmit = async (): Promise<void> => {
				dispatch(authActions.clearError());

				const result = await dispatch(registerAction(payload));

				if (result.meta.requestStatus === "rejected") {
					const errorPayload = result.payload as ThunkErrorPayload | undefined;

					if (errorPayload?.errors) {
						for (const [field, messages] of Object.entries(errorPayload.errors)) {
							setError(field as keyof RegisterRequestDto, {
								message: messages[FIRST_INDEX] ?? "Validation error",
							});
						}
					}
				}
			};

			void executeSubmit();
		},
		[dispatch, setError]
	);

	const handleOnSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>): void => {
			void handleSubmit(handleFormSubmit)(event);
		},
		[handleFormSubmit, handleSubmit]
	);

	return (
		<form className={getValidClassNames(styles["auth-form"])} onSubmit={handleOnSubmit}>
			{error && (
				<div className={getValidClassNames(styles["auth-form__error"])} role="alert">
					{error}
				</div>
			)}

			<Input
				error={errors.name?.message}
				label="Name"
				placeholder="Your name"
				required
				type="text"
				{...register("name")}
			/>

			<Input
				error={errors.email?.message}
				label="Email"
				placeholder="your@email.com"
				required
				type="email"
				{...register("email")}
			/>

			<Input
				error={errors.password?.message}
				iconLeft="lock"
				label="Password"
				placeholder="Enter password"
				required
				type="password"
				{...register("password")}
			/>

			<Input
				error={errors.password_confirmation?.message}
				iconLeft="lock"
				label="Confirm Password"
				placeholder="Confirm password"
				required
				type="password"
				{...register("password_confirmation")}
			/>

			<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
				Register
			</Button>
		</form>
	);
};

export { RegisterForm };
