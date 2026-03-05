import { LevelPreviewCard } from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect, useRef, useTranslation } from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";
import { getLevelsList } from "~/modules/games/slices/actions";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameLevelsPreview: React.FC<Properties> = ({ game }) => {
	const { i18n, t } = useTranslation();
	const dispatch = useAppDispatch();
	const { currentGameLevels, levelsStatus } = useAppSelector((state) => state.games);

	const lastLanguageReference = useRef(i18n.language);

	useEffect(() => {
		const isLanguageChanged = lastLanguageReference.current !== i18n.language;

		if (levelsStatus === DataStatus.IDLE || isLanguageChanged) {
			void dispatch(getLevelsList(game.id));
			lastLanguageReference.current = i18n.language;
		}
	}, [dispatch, game.id, levelsStatus, i18n.language]);

	const isLoading = levelsStatus === DataStatus.PENDING;
	const hasError = levelsStatus === DataStatus.REJECTED;
	const hasLevels = currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH;

	const renderContent = (): React.JSX.Element => {
		if (isLoading) {
			return (
				<div className={getValidClassNames(styles["game-levels-preview__no-content"])}>
					{t("games.levels.loading")}
				</div>
			);
		}

		if (hasError) {
			return (
				<div className={getValidClassNames(styles["game-levels-preview__no-content"])}>
					{t("games.levels.error")}
				</div>
			);
		}

		if (!hasLevels) {
			return (
				<div className={getValidClassNames(styles["game-levels-preview__no-content"])}>
					{t("games.levels.empty")}
				</div>
			);
		}

		return (
			<>
				{currentGameLevels.map((level, index) => (
					<LevelPreviewCard game={game} key={level.id} level={level} number={index} />
				))}
			</>
		);
	};

	return (
		<div>
			<h2 className={getValidClassNames(styles["game-levels-preview__title"])}>
				{t("games.levels.title", { title: game.title })}
			</h2>
			<main aria-live="polite" className={getValidClassNames(styles["game-levels-preview__grid"])}>
				{renderContent()}
			</main>
		</div>
	);
};

export { GameLevelsPreview };
