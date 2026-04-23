import { FIRST_INDEX } from "~/libs/constants/first-index";
import { type UserProfileDto } from "~/modules/profile/profile";

import styles from "./styles.module.css";

type Properties = {
	user: UserProfileDto;
};

const UserProfileCard: React.FC<Properties> = ({ user }) => {
	const initial = user.name.charAt(FIRST_INDEX).toUpperCase() || "?";

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
