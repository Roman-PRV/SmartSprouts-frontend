import type { User } from "~/modules/auth/libs/types/types.js";

import { FIRST_INDEX } from "~/libs/constants/first-index";

import styles from "./styles.module.css";

type Properties = {
	user: User;
};

const UserProfileCard: React.FC<Properties> = ({ user }) => {
	const initial = user.name.charAt(FIRST_INDEX).toUpperCase();

	return (
		<div className={styles["card"]}>
			<div className={styles["card__avatar"]}>{initial}</div>
			<div className={styles["card__info"]}>
				<h2 className={styles["card__name"]}>{user.name}</h2>
				<p className={styles["card__email"]}>{user.email}</p>
			</div>
		</div>
	);
};

export { UserProfileCard };
