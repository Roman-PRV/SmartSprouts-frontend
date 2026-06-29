import { Link } from "~/libs/components/components";
import { GAME_CATEGORY_META, GAME_CATEGORY_ORDER } from "~/libs/constants/constants";
import { AppRoute, type GameCategory } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";
import { type ValueOf } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	activeCategory?: undefined | ValueOf<typeof GameCategory>;
};

const CategoryFilter: React.FC<Properties> = ({ activeCategory }) => {
	const { t } = useTranslation();

	const chips = [
		{
			category: undefined,
			icon: undefined,
			key: "all",
			label: t("games.categories.all"),
			to: AppRoute.GAMES,
		},
		...GAME_CATEGORY_ORDER.map((category) => ({
			category,
			icon: GAME_CATEGORY_META[category].icon,
			key: category,
			label: t(GAME_CATEGORY_META[category].titleKey),
			to: `${AppRoute.GAMES}?category=${category}`,
		})),
	];

	return (
		<nav
			aria-label={t("games.selection.categoriesNavLabel")}
			className={styles["category-filter"]}
		>
			{chips.map((chip) => {
				const isActive = chip.category === activeCategory;

				return (
					<Link
						aria-current={isActive ? "page" : undefined}
						className={getValidClassNames(
							styles["category-filter__chip"],
							isActive && styles["category-filter__chip--active"]
						)}
						key={chip.key}
						to={chip.to}
					>
						{chip.icon ? (
							<span aria-hidden className={styles["category-filter__icon"]}>
								{chip.icon}
							</span>
						) : null}
						{chip.label}
					</Link>
				);
			})}
		</nav>
	);
};

export { CategoryFilter };
