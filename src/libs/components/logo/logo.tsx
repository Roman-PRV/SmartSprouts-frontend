import logo from "~/assets/img/logo_gold_line.png";
import { AppRoute, LogoSize } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { type ValueOf } from "~/libs/types/types";

import { NavLink } from "../components";
import styles from "./styles.module.css";

type Properties = {
	size?: ValueOf<typeof LogoSize>;
};

const Logo: React.FC<Properties> = ({ size = LogoSize.LARGE }) => {
	return (
		<NavLink className={getValidClassNames(styles["logo"])} to={AppRoute.ROOT}>
			<img
				alt="SmartSprouts logo"
				className={styles[`logo__image--${size}`]}
				loading="lazy"
				src={logo}
			/>
		</NavLink>
	);
};

export { Logo };
