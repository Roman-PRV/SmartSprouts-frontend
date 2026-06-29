import { Link } from "~/libs/components/components";
import { AppRoute, GameCategory } from "~/libs/enums/enums";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";
import { type ValueOf } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
	activeCategory?: undefined | ValueOf<typeof GameCategory>;
};

const CATEGORY_ICON: Record<ValueOf<typeof GameCategory>, string> = {
	[GameCategory.LOGIC]: "🧩",
	[GameCategory.MATH]: "🧮",
	[GameCategory.READING]: "📚",
};

const CATEGORY_ORDER = [GameCategory.MATH, GameCategory.READING, GameCategory.LOGIC];

const CategoryFilter: React.FC<Properties> = ({ activeCategory }) => {
	const { t } = useTranslation();

	const chips = [
		{
			category: undefined,
			icon: undefined,
			key: "all",
			label: t("games.selection.categories.all"),
			to: AppRoute.GAMES,
		},
		...CATEGORY_ORDER.map((category) => ({
			category,
			icon: CATEGORY_ICON[category],
			key: category,
			label: t(`home.categories.${category}.title`),
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
