import { type UseFormRegisterReturn } from "react-hook-form";

import { Checkbox, Link, Trans } from "~/libs/components/components";
import { AppRoute } from "~/libs/enums/enums";

import styles from "./styles.module.css";

type Properties = {
	error?: string | undefined;
	registration: UseFormRegisterReturn;
};

/**
 * The 18+/guardian affirmation checkbox with Terms and Privacy links, shared by
 * the registration form and the consent gate so the legal wording, link order,
 * and security attributes stay in one place.
 */
const ConsentCheckbox: React.FC<Properties> = ({ error, registration }) => (
	<Checkbox
		error={error}
		label={
			<Trans
				components={[
					<Link
						className={styles["consent-checkbox__link"]}
						key="0"
						rel="noopener noreferrer"
						target="_blank"
						to={AppRoute.TERMS}
					/>,
					<Link
						className={styles["consent-checkbox__link"]}
						key="1"
						rel="noopener noreferrer"
						target="_blank"
						to={AppRoute.PRIVACY}
					/>,
				]}
				i18nKey="auth.consent.label"
			/>
		}
		required
		{...registration}
	/>
);

export { ConsentCheckbox };
