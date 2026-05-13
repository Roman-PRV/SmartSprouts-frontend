import {
	LanguageSwitcher,
	LanguageSwitcherVariant,
	Logo,
	Navigation,
} from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header className={getValidClassNames(styles["header"])}>
			<div className={styles["header__nav"]}>
				<Navigation />
			</div>

			<div className={styles["header__logo"]}>
				<Logo />
			</div>

			<div className={styles["header__lang"]}>
				<LanguageSwitcher variant={LanguageSwitcherVariant.BASE} />
			</div>
		</header>
	);
};

export { Header };
