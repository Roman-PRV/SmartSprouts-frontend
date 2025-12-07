import { Link } from "~/libs/components/components";
import { UI_INDEX_BASE } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useState } from "~/libs/hooks/hooks";
import { type GameDescriptionDto, type LevelDescriptionDto } from "~/libs/types/types";

import styles from "./styles.module.css";

type Properties = {
    game: GameDescriptionDto;
    level: LevelDescriptionDto;
    number: number;
};

const LevelPreviewCard: React.FC<Properties> = ({ game, level, number }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = useCallback((): void => {
        setImageError(true);
    }, []);

    return (
        <Link
            className={getValidClassNames(styles["card"])}
            to={`/games/${game.id}/levels/${level.id}`}
        >
            {imageError ? (
                <div className={getValidClassNames(styles["card__image-fallback"])}>
                    <span>Image unavailable</span>
                </div>
            ) : (
                <img
                    alt={level.title}
                    aria-label={`Image unavailable: ${level.title}`}
                    className={getValidClassNames(styles["card__image"])}
                    height={120}
                    loading="lazy"
                    onError={handleImageError}
                    src={level.image_url}
                    width={200}
                />
            )}
            <div className={getValidClassNames(styles["card__content"])}>
                <p className={getValidClassNames(styles["card__number"])}>Level {number + UI_INDEX_BASE}</p>
                <p className={getValidClassNames(styles["card__title"])}>{level.title}</p>
            </div>
        </Link>
    );
};

export { LevelPreviewCard };
