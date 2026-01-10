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
	login,
	type LoginRequestDto,
	loginSchema,
} from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

const LoginForm: React.FC = () => {
	const dispatch = useAppDispatch();
	const { dataStatus, error } = useAppSelector((state) => state.auth);

	const {
		formState: { errors },
		handleSubmit,
		register,
		setError,
	} = useForm<LoginRequestDto>({
		defaultValues: {
			email: "",
			password: "",
		},
		resolver: zodResolver(loginSchema),
	});

	const isLoading = dataStatus === DataStatus.PENDING;

	const handleFormSubmit = useCallback(
		(payload: LoginRequestDto): void => {
			const executeSubmit = async (): Promise<void> => {
				dispatch(authActions.clearError());

				const result = await dispatch(login(payload));

				if (result.meta.requestStatus === "rejected") {
					const errorPayload = result.payload as ThunkErrorPayload | undefined;

					if (errorPayload?.errors) {
						for (const [field, messages] of Object.entries(errorPayload.errors)) {
							if (Object.hasOwn(payload, field)) {
								setError(field as keyof LoginRequestDto, {
									message: messages[FIRST_INDEX] ?? "Validation error",
								});
							}
						}
					}
				}
			};

			void executeSubmit();
		},
		[dispatch, setError]
	);

	return (
		<form
			className={getValidClassNames(styles["auth-form"])}
			noValidate
			onSubmit={handleSubmit(handleFormSubmit)}
		>
			{error && (
				<div className={getValidClassNames(styles["auth-form__error"])} role="alert">
					{error}
				</div>
			)}

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

			<Button fullWidth isLoading={isLoading} size="lg" type="submit" variant="primary">
				Login
			</Button>
		</form>
	);
};

export { LoginForm };
