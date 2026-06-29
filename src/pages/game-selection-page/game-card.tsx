import { FallbackImage, Link } from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH, GAME_CATEGORY_META } from "~/libs/constants/constants";
import { AppRoute } from "~/libs/enums/enums";
import { configureString, getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	game: GameDescriptionDto;
};

const GameCard: React.FC<Properties> = ({ game }) => {
	const { t } = useTranslation();

	const gamePath = configureString(AppRoute.GAME_CONTENT, {
		id: game.id.toString(),
	});

	const categories = game.categories ?? [];

	return (
		<Link className={getValidClassNames(styles["game-card"])} to={gamePath}>
			<FallbackImage
				alt={game.title}
				className={getValidClassNames(styles["game-card__image"])}
				src={game.icon_url}
			/>
			<div className={getValidClassNames(styles["game-card__content"])}>
				<h2 className={getValidClassNames(styles["game-card__title"])}>{game.title}</h2>
				<p className={getValidClassNames(styles["game-card__description"])}>{game.description}</p>
				{categories.length > EMPTY_ARRAY_LENGTH ? (
					<div className={styles["game-card__badges"]}>
						{categories.map((category) => (
							<span className={styles["game-card__badge"]} key={category}>
								<span aria-hidden>{GAME_CATEGORY_META[category].icon}</span>
								{t(GAME_CATEGORY_META[category].titleKey)}
							</span>
						))}
					</div>
				) : null}
			</div>
		</Link>
	);
};

export { GameCard };
