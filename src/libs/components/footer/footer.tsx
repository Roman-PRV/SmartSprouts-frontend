import { Link } from "react-router-dom";

import { AppRoute } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const Footer: React.FC = () => {
	const { t } = useTranslation();

	return (
		<footer className={getValidClassNames(styles["footer"])}>
			<p className={styles["footer__copyright"]}>
				{t("common.footer.copyright", { year: new Date().getFullYear() })}
			</p>
			<nav aria-label={t("common.footer.navLabel")} className={styles["footer__nav"]}>
				<Link className={styles["footer__link"]} to={AppRoute.ABOUT}>
					{t("common.footer.about")}
				</Link>
				<Link className={styles["footer__link"]} to={AppRoute.PRIVACY}>
					{t("legal.links.privacy")}
				</Link>
				<Link className={styles["footer__link"]} to={AppRoute.TERMS}>
					{t("legal.links.terms")}
				</Link>
			</nav>
		</footer>
	);
};

export { Footer };
