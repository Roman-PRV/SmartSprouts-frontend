import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
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
	const currentGameLevels = useAppSelector((state) => state.games.currentGameLevels);
	const levelsStatus = useAppSelector((state) => state.games.levelsStatus);

	const fetchLevels = useCallback(() => {
		void dispatch(getLevelsList(game.id));
	}, [dispatch, game.id]);

	useLanguageSync(fetchLevels);

	useEffect(() => {
		if (levelsStatus === DataStatus.IDLE) {
			fetchLevels();
		}
	}, [fetchLevels, levelsStatus]);

	const isLoading = levelsStatus === DataStatus.PENDING || levelsStatus === DataStatus.IDLE;
	const hasError = levelsStatus === DataStatus.REJECTED;
	const hasLevels = Boolean(currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH);

	return (
		<div className={styles["game-levels-preview__container"]}>
			<h2 className={styles["game-levels-preview__title"]}>
				{t("games.levels.title", { title: game.title })}
			</h2>
			<section aria-live="polite" className={styles["game-levels-preview__grid"]}>
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
