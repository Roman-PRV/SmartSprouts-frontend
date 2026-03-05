import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import {
	useAppDispatch,
	useAppSelector,
	useCallback,
	useEffect,
	useLanguageSync,
	useTranslation,
} from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";
import { getLevelsList } from "~/modules/games/slices/actions";

import { GameLevelsContent } from "./game-levels-content/game-levels-content";
import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameLevelsPreview: React.FC<Properties> = ({ game }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { currentGameLevels, levelsStatus } = useAppSelector((state) => state.games);

	useLanguageSync(
		useCallback(() => {
			void dispatch(getLevelsList(game.id));
		}, [dispatch, game.id])
	);

	useEffect(() => {
		if (levelsStatus === DataStatus.IDLE) {
			void dispatch(getLevelsList(game.id));
		}
	}, [dispatch, game.id, levelsStatus]);

	const isLoading = levelsStatus === DataStatus.PENDING;
	const hasError = levelsStatus === DataStatus.REJECTED;
	const hasLevels = Boolean(currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH);

	return (
		<div>
			<h2 className={getValidClassNames(styles["game-levels-preview__title"])}>
				{t("games.levels.title", { title: game.title })}
			</h2>
			<section aria-live="polite" className={getValidClassNames(styles["game-levels-preview__grid"])}>
				<GameLevelsContent
					game={game}
					hasError={hasError}
					hasLevels={hasLevels}
					isLoading={isLoading}
					levels={currentGameLevels ?? []}
				/>
			</section>
		</div>
	);
};

export { GameLevelsPreview };
