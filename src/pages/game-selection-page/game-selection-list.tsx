import { FallbackMessage, Loader } from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { useAppSelector, useTranslation } from "~/libs/hooks/hooks";

import { GameCard } from "./game-card";
import styles from "./styles.module.css";

const GameSelectionList: React.FC = () => {
	const { t } = useTranslation();
	const games = useAppSelector((state) => state.games.games);
	const gamesStatus = useAppSelector((state) => state.games.gamesStatus);

	const isLoading = gamesStatus === DataStatus.IDLE || gamesStatus === DataStatus.PENDING;
	const isFailed = gamesStatus === DataStatus.REJECTED;
	const isEmpty = gamesStatus === DataStatus.FULFILLED && games.length === EMPTY_ARRAY_LENGTH;

	if (isLoading) {
		return <Loader variant="overlay" />;
	}

	if (isFailed) {
		return <FallbackMessage message={t("games.selection.error")} />;
	}

	if (isEmpty) {
		return (
			<div className={styles["game-selection-page__no-games"]}>{t("games.selection.empty")}</div>
		);
	}

	return (
		<>
			{games.map((game) => (
				<GameCard game={game} key={game.id} />
			))}
		</>
	);
};

export { GameSelectionList };
