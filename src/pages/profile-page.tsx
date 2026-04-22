import { useTranslation } from "~/libs/hooks/hooks";

import { UserAnalytics, UserProfileCard } from "./profile-page/components/components";
import styles from "./profile-page/styles.module.css";

const ProfilePage: React.FC = () => {
	const { t } = useTranslation();

	// TODO: Replace with useProfileFetch() or similar hook connecting to ProfileController
	const mockProfileUser = {
		analytics: {
			completedLevels: 30,
			correctAnswersPercentage: 85,
			totalLevels: 42
		},
		email: "player@smartsprouts.com",
		id: 1,
		name: "Mock Username"
	};

	return (
		<div className={styles["page-container"]}>
			<h1 className={styles["page-title"]}>{t("profile.title", "My Profile")}</h1>
			<UserProfileCard user={mockProfileUser} />
			<UserAnalytics user={mockProfileUser} />
		</div>
	);
};

export { ProfilePage };
