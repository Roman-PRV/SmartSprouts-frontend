import { getValidClassNames } from "~/libs/helpers/helpers";
import { useProgress, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

/** SVG ring geometry constants */
const RING_RADIUS = 44;
const RING_STROKE_WIDTH = 8;
const DIAMETER_TO_RADIUS_FACTOR = 2;
const RING_CIRCUMFERENCE = DIAMETER_TO_RADIUS_FACTOR * Math.PI * RING_RADIUS;
const STEP = 1;
const FULL_PROGRESS_FRACTION = 1;
const PROGRESS_PERCENT_SCALE = 100;

/** Number of pulsing decorative squares */
const SQUARE_COUNT = 3;

type Properties = {
	/**
	 * Extends the root element with custom css classes
	 */
	className?: string;
	/**
	 * When true the loader renders as a fixed full-screen overlay.
	 * When false (default) it renders inline with `position: relative`.
	 */
	hasOverlay?: boolean;
	/**
	 * External controlled progress value (0-100).
	 * When omitted the internal simulation runs automatically.
	 */
	progress?: number;
};

const Loader: React.FC<Properties> = ({
	className,
	hasOverlay = false,
	progress: externalProgress,
}) => {
	const { t } = useTranslation();
	const { progress } = useProgress(externalProgress);

	const strokeDashoffset =
		RING_CIRCUMFERENCE * (FULL_PROGRESS_FRACTION - progress / PROGRESS_PERCENT_SCALE);

	return (
		<div
			className={getValidClassNames(
				hasOverlay ? styles["loader--overlay"] : styles["loader--inline"],
				className
			)}
		>
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
				<div
					aria-label={t("common.accessibility.loading")}
					aria-valuemax={100}
					aria-valuemin={0}
					aria-valuenow={progress}
					className={styles["loader__ring-wrapper"]}
					role="progressbar"
				>
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
							strokeDashoffset={strokeDashoffset}
							strokeWidth={RING_STROKE_WIDTH}
						/>
					</svg>

					<span className={styles["loader__ring-label"]}>{Math.round(progress)}%</span>
				</div>
			</div>
		</div>
	);
};

export { Loader };
