import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, Input } from "~/libs/components/components";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppSelector } from "~/libs/hooks/hooks";
import {
	login,
	type LoginRequestDto,
	loginSchema,
	useAuthFormSubmit,
} from "~/modules/auth/auth";
import styles from "~/modules/auth/styles/auth-form.module.css";

type Properties = {
	onSuccess?: () => void;
};

const LoginForm: React.FC<Properties> = ({ onSuccess }) => {
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

	const handleFormSubmit = useAuthFormSubmit({
		action: login,
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
