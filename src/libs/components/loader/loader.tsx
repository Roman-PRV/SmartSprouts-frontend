import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

/** SVG ring geometry constants */
const RING_RADIUS = 44;
const RING_STROKE_WIDTH = 8;
const DIAMETER_TO_RADIUS_FACTOR = 2;
const RING_CIRCUMFERENCE = DIAMETER_TO_RADIUS_FACTOR * Math.PI * RING_RADIUS;
const QUARTER = 4;
const RING_DASH_OFFSET = RING_CIRCUMFERENCE / QUARTER;
const STEP = 1;

/** Number of pulsing decorative squares */
const SQUARE_COUNT = 3;

type Properties = {
	/**
	 * Extends the root element with custom css classes
	 */
	className?: string;
	/**
	 * Defines the positioning and sizing variant of the loader.
	 * - `inline` (default): renders inline with `position: relative`
	 * - `overlay`: renders as a fixed full-screen overlay
	 * - `page`: centers the loader within the full viewport height using flexbox
	 */
	variant?: "inline" | "overlay" | "page";
};

const Loader: React.FC<Properties> = ({ className, variant = "inline" }) => {
	const { t } = useTranslation();

	return (
		<div className={getValidClassNames(styles[`loader--${variant}`], className)}>
			<div className={styles["loader__content"]}>
				{/* Pulsing decorative squares */}
				{Array.from({ length: SQUARE_COUNT }, (_, index) => {
					const squareIndexClass = `loader__square--${String(index + STEP)}`;

					return (
						<span
							className={getValidClassNames(styles["loader__square"], styles[squareIndexClass])}
							key={index}
						/>
					);
				})}

				{/* SVG circular progress ring */}
				<div className={styles["loader__ring-wrapper"]} role="status">
					<span className="visually-hidden">{t("common.accessibility.loading")}</span>
					<svg
						className={styles["loader__ring-svg"]}
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
					>
						{/* Track ring (background) */}
						<circle
							className={styles["loader__ring-track"]}
							cx="50"
							cy="50"
							r={RING_RADIUS}
							strokeWidth={RING_STROKE_WIDTH}
						/>

						{/* Progress ring (fill) */}
						<circle
							className={styles["loader__ring-circle"]}
							cx="50"
							cy="50"
							r={RING_RADIUS}
							strokeDasharray={RING_CIRCUMFERENCE}
							strokeDashoffset={RING_DASH_OFFSET}
							strokeWidth={RING_STROKE_WIDTH}
						/>
					</svg>
				</div>
			</div>
		</div>
	);
};

export { Loader };
