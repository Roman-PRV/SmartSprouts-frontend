import React from "react";

import { getValidClassNames } from "~/libs/helpers/helpers";

import styles from "./styles.module.css";

const Footer: React.FC = () => {
	return (
		<footer className={getValidClassNames(styles["footer"])}>
			<p>© 2025 SmartSprouts. All rights reserved.</p>
		</footer>
	);
};

export { Footer };
