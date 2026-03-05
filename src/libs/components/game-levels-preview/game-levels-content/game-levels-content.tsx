import { LevelPreviewCard } from "~/libs/components/components";
import { useTranslation } from "~/libs/hooks/hooks";
import { type GameDescriptionDto, type LevelDescriptionDto } from "~/libs/types/types";

import styles from "../styles.module.css";

type Properties = {
	game: GameDescriptionDto;
	hasError: boolean;
	hasLevels: boolean;
	isLoading: boolean;
	levels: LevelDescriptionDto[];
};

const GameLevelsContent: React.FC<Properties> = ({
	game,
	hasError,
	hasLevels,
	isLoading,
	levels,
}) => {
	const { t } = useTranslation();

	if (isLoading) {
		return (
			<div className={styles["game-levels-preview__no-content"]}>{t("games.levels.loading")}</div>
		);
	}

	if (hasError) {
		return (
			<div className={styles["game-levels-preview__no-content"]}>{t("games.levels.error")}</div>
		);
	}

	if (!hasLevels) {
		return (
			<div className={styles["game-levels-preview__no-content"]}>{t("games.levels.empty")}</div>
		);
	}

	return (
		<>
			{levels.map((level, index) => (
				<LevelPreviewCard game={game} key={level.id} level={level} number={index} />
			))}
		</>
	);
};

export { GameLevelsContent };
