import { FallbackImage, Link } from "~/libs/components/components";
import { UI_INDEX_BASE } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";
import {
	type GameDescriptionDto,
	type LevelDescriptionDto,
	type LevelProgress,
} from "~/libs/types/types";

import styles from "./styles.module.css";

const PROGRESS_MODIFIER: Record<LevelProgress, string | undefined> = {
	mastered: styles["card--mastered"],
	not_perfect: styles["card--not-perfect"],
	not_started: undefined,
};

const PROGRESS_LABEL_KEY: Record<LevelProgress, string | undefined> = {
	mastered: "games.levels.progress.mastered",
	not_perfect: "games.levels.progress.notPerfect",
	not_started: undefined,
};

type Properties = {
	game: GameDescriptionDto;
	level: LevelDescriptionDto;
	number: number;
};

const LevelPreviewCard: React.FC<Properties> = ({ game, level, number }) => {
	const { t } = useTranslation();

	const progressModifier = PROGRESS_MODIFIER[level.progress];
	const progressLabelKey = PROGRESS_LABEL_KEY[level.progress];

	return (
		<Link
			className={getValidClassNames(styles["card"], progressModifier)}
			to={`/games/${game.id}/levels/${level.id}`}
		>
			<FallbackImage
				alt={level.title}
				className={getValidClassNames(styles["card__image"])}
				height={120}
				loading="lazy"
				src={level.image_url}
				width={200}
			/>
			<div className={getValidClassNames(styles["card__content"])}>
				<p className={getValidClassNames(styles["card__number"])}>Level {number + UI_INDEX_BASE}</p>
				<p className={getValidClassNames(styles["card__title"])}>{level.title}</p>
			</div>
			{progressLabelKey ? <span className="visually-hidden">{t(progressLabelKey)}</span> : null}
		</Link>
	);
};

export { LevelPreviewCard };
