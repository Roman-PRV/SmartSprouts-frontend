import { Link } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";

type AuthLayoutProperties = {
	children: React.ReactNode;
	footerLinkText: string;
	footerLinkTo: string;
	footerText: string;
	subtitle: string;
	title: string;
};

const AuthLayout: React.FC<AuthLayoutProperties> = ({
	children,
	footerLinkText,
	footerLinkTo,
	footerText,
	subtitle,
	title,
}) => {
	return (
		<div className={getValidClassNames(styles["auth-page"])}>
			<div className={getValidClassNames(styles["auth-page__container"])}>
				<div className={getValidClassNames(styles["auth-page__card"])}>
					<h1 className={getValidClassNames(styles["auth-page__title"])}>{title}</h1>
					<p className={getValidClassNames(styles["auth-page__subtitle"])}>{subtitle}</p>

					{children}

					<p className={getValidClassNames(styles["auth-page__footer"])}>
						{footerText}{" "}
						<Link className={getValidClassNames(styles["auth-page__link"])} to={footerLinkTo}>
							{footerLinkText}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export { AuthLayout };
