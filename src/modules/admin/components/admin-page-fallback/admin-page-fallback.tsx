import { FallbackMessage } from "~/libs/components/components";

import styles from "./styles.module.css";

type Properties = {
	message: string;
};

const AdminPageFallback: React.FC<Properties> = ({ message }) => {
	return (
		<div className={styles["admin-page-fallback"]}>
			<FallbackMessage message={message} />
		</div>
	);
};

export { AdminPageFallback };
