import logo from "~/assets/img/logo_gold_line.png";
import { LogoSize } from "~/libs/enums/enums";
import { type ValueOf } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	size?: ValueOf<typeof LogoSize>;
};

const Logo: React.FC<Properties> = ({ size = LogoSize.LARGE }) => {
	return (
		<div className={styles["logo"]}>
			<img
				alt="SmartSprouts logo"
				className={styles[`logo__image--${size}`]}
				loading="lazy"
				src={logo}
			/>
		</div>
	);
};

export { Logo };
