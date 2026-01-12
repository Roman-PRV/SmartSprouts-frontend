import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector } from "~/libs/hooks/hooks";
import {
	register as registerAction,
	type RegisterRequestDto,
	registerSchema,
	useAuthFormSubmit,
} from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

type Properties = {
	onSuccess?: () => void;
};

const RegisterForm: React.FC<Properties> = ({ onSuccess }) => {
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

	const handleFormSubmit = useAuthFormSubmit({
		action: registerAction,
		onSuccess,
		setError,
	});

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
