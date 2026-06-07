import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const AdminWelcomePage: React.FC = () => {
	const { t } = useTranslation();

	return (
		<div className={styles["page"]}>
			<h1 className={styles["page__title"]}>{t("admin.welcome.title")}</h1>
			<p className={styles["page__description"]}>{t("admin.welcome.description")}</p>
		</div>
	);
};

export { AdminWelcomePage };
