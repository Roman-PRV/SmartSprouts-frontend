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

type ProgressPresentation = {
	labelKey: string;
	modifier: string | undefined;
};

// One source of truth per status: frame modifier + label key change together.
// `null` means "no frame, no label" (never attempted).
const PROGRESS_PRESENTATION: Record<LevelProgress, null | ProgressPresentation> = {
	mastered: { labelKey: "games.levels.progress.mastered", modifier: styles["card--mastered"] },
	not_perfect: {
		labelKey: "games.levels.progress.notPerfect",
		modifier: styles["card--not-perfect"],
	},
	not_started: null,
};

type Properties = {
	game: GameDescriptionDto;
	level: LevelDescriptionDto;
	number: number;
};

const LevelPreviewCard: React.FC<Properties> = ({ game, level, number }) => {
	const { t } = useTranslation();

	const presentation = PROGRESS_PRESENTATION[level.progress];
	const progressLabel = presentation ? t(presentation.labelKey) : undefined;

	return (
		<Link
			className={getValidClassNames(styles["card"], presentation?.modifier)}
			title={progressLabel}
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
			{progressLabel === undefined ? null : (
				<span className="visually-hidden">{progressLabel}</span>
			)}
		</Link>
	);
};

export { LevelPreviewCard };
