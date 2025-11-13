import { Link } from "~/libs/components/components";
import { UI_INDEX_BASE } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { type GameDescriptionDto, type LevelDescriptionDto } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
	level: LevelDescriptionDto;
	number: number;
};

const LevelPreviewCard: React.FC<Properties> = ({ game, level, number }) => {
	return (
		<Link
			className={getValidClassNames(styles["card"])}
			to={`/games/${game.id}/levels/${level.id}`}
		>
			<img
				alt={level.title}
				className={getValidClassNames(styles["card__image"])}
				src={level.image_url}
			/>
			<div className={getValidClassNames(styles["card__content"])}>
				<p className={getValidClassNames(styles["card__number"])}>Level {number + UI_INDEX_BASE}</p>
				<p className={getValidClassNames(styles["card__title"])}>{level.title}</p>
			</div>
		</Link>
	);
};

export { LevelPreviewCard };
