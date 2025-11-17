import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect } from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/game-description-dto.type";
import { getLevelsList } from "~/modules/games/slices/actions";

import { LevelPreviewCard } from "./level-preview-card";
import styles from "./styles.module.css";

type Properties = { game: GameDescriptionDto };

const TrueFalseImagePreview: React.FC<Properties> = ({ game }) => {
	const dispatch = useAppDispatch();
	const { currentGameLevels, levelsStatus } = useAppSelector((s) => s.games);

	useEffect(() => {
		void dispatch(getLevelsList(game.id));
	}, [dispatch, game.id]);

	const isLoading = levelsStatus === DataStatus.PENDING;
	const hasError = levelsStatus === DataStatus.REJECTED;
	const hasLevels = currentGameLevels && currentGameLevels.length > EMPTY_ARRAY_LENGTH;

	const renderContent = (): React.JSX.Element => {
		if (isLoading) {
			return <div className={getValidClassNames(styles["no-content"])}>Loading levels…</div>;
		}

		if (hasError) {
			return (
				<div className={getValidClassNames(styles["no-content"])}>
					Failed to load levels. Please try again.
				</div>
			);
		}

		if (!hasLevels) {
			return (
				<div className={getValidClassNames(styles["no-content"])}>
					No levels available at the moment.
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
			<h2 className={getValidClassNames(styles["game-title"])}>
				Select a level for the {game.title} game
			</h2>
			<main aria-live="polite" className={getValidClassNames(styles["grid"])}>
				{renderContent()}
			</main>
		</div>
	);
};

export { TrueFalseImagePreview };
