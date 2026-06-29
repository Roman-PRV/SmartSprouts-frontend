import { GameCategory } from "~/libs/enums/enums";
import {
	useAppDispatch,
	useCallback,
	useEffect,
	useLanguageSync,
	useSearchParams,
	useTranslation,
} from "~/libs/hooks/hooks";
import { type ValueOf } from "~/libs/types/types";
import { actions as gamesActions } from "~/modules/games/games";

import { GameSelectionList } from "./game-selection-list";
import styles from "./styles.module.css";

const CATEGORY_QUERY_PARAM = "category";

const isGameCategory = (value: null | string): value is ValueOf<typeof GameCategory> =>
	value !== null && Object.values(GameCategory).includes(value as ValueOf<typeof GameCategory>);

const GameSelectionPage: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [searchParameters] = useSearchParams();

	const categoryParameter = searchParameters.get(CATEGORY_QUERY_PARAM);
	const category = isGameCategory(categoryParameter) ? categoryParameter : undefined;

	const fetchGames = useCallback(() => {
		void dispatch(gamesActions.getAllGames(category));
	}, [dispatch, category]);

	useLanguageSync(fetchGames);

	useEffect(() => {
		fetchGames();
	}, [fetchGames]);

	return (
		<div className={styles["game-selection-page__container"]}>
			<header className={styles["game-selection-page__header"]}>
				<h1 className={styles["game-selection-page__title"]}>{t("games.selection.title")}</h1>
			</header>

			<main aria-live="polite" className={styles["game-selection-page__grid"]}>
				<GameSelectionList />
			</main>
		</div>
	);
};

export { GameSelectionPage };
