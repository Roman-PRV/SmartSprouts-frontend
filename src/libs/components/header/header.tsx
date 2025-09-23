import { Logo, Navigation } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/get-valid-class-names.helper";

import styles from "./styles.module.css";

const Header: React.FC = () => {
	return (
		<header
			className={getValidClassNames(
				styles["header"],
				"flex items-center justify-between px-2 sm:px-4 lg:px-6 py-4"
			)}
		>
			<Logo />
			<Navigation />
		</header>
	);
};

export { Header };
