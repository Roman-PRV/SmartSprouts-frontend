import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button, Checkbox, Link, Trans } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";
import { useAppDispatch, useEffect, useForm, useRef, useTranslation } from "~/libs/hooks/hooks";
import {
	acceptConsents,
	type ConsentGateFormValues,
	consentGateSchema,
} from "~/modules/auth/auth";

import styles from "./styles.module.css";

/**
 * Blocks the protected app area for an authenticated user whose consent is not
 * current: Google signups (no consent captured at creation), legacy accounts,
 * and re-consent after a legal-document version bump. Rendered in place of the
 * protected route content — the public landing and the legal pages stay
 * reachable, since the affirmation links open Terms/Privacy in a new tab.
 */
const ConsentGate: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const headingReference = useRef<HTMLHeadingElement>(null);

	// Focus the blocker's heading when it replaces the content behind it (a11y).
	useEffect(() => {
		headingReference.current?.focus();
	}, []);

	const {
		formState: { errors, isSubmitting },
		handleSubmit,
		register,
	} = useForm<ConsentGateFormValues>({
		defaultValues: { accepted_terms: false },
		resolver: zodResolver(consentGateSchema),
	});

	const handleFormSubmit = async (): Promise<void> => {
		try {
			await dispatch(acceptConsents()).unwrap();
		} catch {
			toast.error(t("auth.consentGate.error"));
		}
	};

	return (
		<div className={styles["gate"]}>
			<div className={styles["gate__card"]}>
				<h1 className={styles["gate__title"]} ref={headingReference} tabIndex={-1}>
					{t("auth.consentGate.title")}
				</h1>
				<p className={styles["gate__description"]}>{t("auth.consentGate.description")}</p>

				<form
					className={styles["gate__form"]}
					noValidate
					onSubmit={handleSubmit(handleFormSubmit)}
				>
					<Checkbox
						error={errors.accepted_terms?.message && t(errors.accepted_terms.message)}
						label={
							<Trans
								components={[
									<Link
										className={styles["gate__link"]}
										key="0"
										rel="noopener noreferrer"
										target="_blank"
										to={AppRoute.TERMS}
									/>,
									<Link
										className={styles["gate__link"]}
										key="1"
										rel="noopener noreferrer"
										target="_blank"
										to={AppRoute.PRIVACY}
									/>,
								]}
								i18nKey="auth.register.consent.label"
							/>
						}
						required
						{...register("accepted_terms")}
					/>

					<Button fullWidth isLoading={isSubmitting} size="lg" type="submit" variant="primary">
						{t("auth.consentGate.button")}
					</Button>
				</form>
			</div>
		</div>
	);
};

export { ConsentGate };
