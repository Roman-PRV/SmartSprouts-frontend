import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { DataStatus } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useAppDispatch, useAppSelector, useEffect, useParams, useRef } from "~/libs/hooks/hooks";
import { loadGameWithLevels } from "~/modules/games/slices/actions";

import { LevelPreviewCard } from "./level-preview-card";
import styles from "./styles.module.css";

const TrueFalseImagePreview: React.FC = () => {
	const { id: gameId } = useParams();
	const dispatch = useAppDispatch();

	const inFlightIdReference = useRef<null | string>(null);

	const currentGame = useAppSelector((s) => s.games.currentGame);
	const currentGameLevels = useAppSelector((s) => s.games.currentGameLevels);
	const currentGameStatus = useAppSelector((s) => s.games.currentGameStatus);
	const levelsStatus = useAppSelector((s) => s.games.levelsStatus);

	useEffect(() => {
		if (!gameId) {
			return;
		}

		if (inFlightIdReference.current === gameId) {
			return;
		}

		const alreadyLoaded =
			currentGame &&
			currentGame.id === gameId &&
			Array.isArray(currentGameLevels) &&
			currentGameLevels.length > EMPTY_ARRAY_LENGTH &&
			currentGameStatus === DataStatus.FULFILLED &&
			levelsStatus === DataStatus.FULFILLED;

		if (alreadyLoaded) {
			return;
		}

		inFlightIdReference.current = gameId;

		void dispatch(loadGameWithLevels(gameId))
			.unwrap()
			.catch(() => {
				/* swallow — slice handles statuses */
			})
			.finally(() => {
				if (inFlightIdReference.current === gameId) {
					inFlightIdReference.current = null;
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, gameId]);

	let content: React.ReactNode;

	if (currentGameStatus === DataStatus.PENDING || levelsStatus === DataStatus.PENDING) {
		content = <div className={getValidClassNames(styles["no-content"])}>Loading levels…</div>;
	} else if (currentGameStatus === DataStatus.REJECTED || levelsStatus === DataStatus.REJECTED) {
		content = (
			<div className={getValidClassNames(styles["no-content"])}>
				<p>Failed to load levels. Please try again.</p>
			</div>
		);
	} else if (
		currentGame &&
		Array.isArray(currentGameLevels) &&
		currentGameLevels.length > EMPTY_ARRAY_LENGTH
	) {
		content = (
			<>
				{currentGameLevels.map((level, index) => (
					<LevelPreviewCard game={currentGame} key={level.id} level={level} number={index} />
				))}
			</>
		);
	} else {
		content = (
			<div className={getValidClassNames(styles["no-content"])}>
				No levels available at the moment.
			</div>
		);
	}

	return (
		<div>
			<h2 className={getValidClassNames(styles["game-title"])}>
				Select a level for the TrueFalseImage game
			</h2>
			<main aria-live="polite" className={getValidClassNames(styles["grid"])}>
				{content}
			</main>
		</div>
	);
};

export { TrueFalseImagePreview };
