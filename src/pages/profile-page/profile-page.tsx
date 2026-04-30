import { FallbackMessage, Loader } from "~/libs/components/components";
import { useProfileFetch, useTranslation } from "~/libs/hooks/hooks";

import { ChangePasswordForm, UserAnalytics, UserProfileCard } from "./components/components";
import { getAnalyticsItems } from "./libs/helpers/helpers";
import styles from "./styles.module.css";

const ProfilePage: React.FC = () => {
	const { t } = useTranslation();
	const { data: profile, error, isError, isLoading } = useProfileFetch();

	if (isLoading) {
		return <Loader variant="page" />;
	}

	const analyticsItems = profile ? getAnalyticsItems({ stats: profile.stats, t }) : [];

	return (
		<div className={styles["page-container"]}>
			{isError || !profile ? (
				<FallbackMessage message={error || t("profile.error")} />
			) : (
				<>
					<h1 className={styles["page-title"]}>{t("profile.title")}</h1>
					<UserProfileCard user={profile} />
					<UserAnalytics items={analyticsItems} />
					<ChangePasswordForm />
				</>
			)}
		</div>
	);
};

export { ProfilePage };
