import {
	type FindTheWrongRevealItemDto,
	type SubmitAttemptResponseDto,
} from "~/games/find-the-wrong/find-the-wrong";
import { AudioPlayButton, Button } from "~/libs/components/components";
import { EMPTY_ARRAY_LENGTH } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

const MAX_STARS = 3;
const NO_STARS = 0;
const FIRST_STAR = 1;

type Properties = {
	onPlayAgain: () => void;
	onReview: () => void;
	result: SubmitAttemptResponseDto;
};

const renderStars = (stars: number): string => {
	const filled = "★".repeat(stars);
	const empty = "☆".repeat(MAX_STARS - stars);

	return `${filled}${empty}`;
};

type RevealRowProperties = {
	item: FindTheWrongRevealItemDto;
	muted?: boolean;
};

const RevealRow: React.FC<RevealRowProperties> = ({ item, muted = false }) => {
	const stars = item.stars ?? NO_STARS;

	return (
		<li className={getValidClassNames(styles["row"], muted && styles["row--muted"])}>
			<div className={styles["row__header"]}>
				<span className={styles["row__name"]}>{item.name}</span>
				<AudioPlayButton url={item.name_audio_url} />
				{stars >= FIRST_STAR && (
					<span
						aria-label={`${String(stars)}/${String(MAX_STARS)}`}
						className={styles["row__stars"]}
					>
						{renderStars(stars)}
					</span>
				)}
			</div>
			<div className={styles["row__explanation"]}>
				<p className={styles["row__explanation-text"]}>{item.explanation}</p>
				<AudioPlayButton url={item.explanation_audio_url} />
			</div>
		</li>
	);
};

const FindTheWrongResultPanel: React.FC<Properties> = ({ onPlayAgain, onReview, result }) => {
	const { t } = useTranslation();

	return (
		<div className={styles["panel"]}>
			<h2 className={styles["panel__score"]}>
				{t("games.findTheWrong.result.scoreSummary", {
					score: result.score,
					total: result.total_questions,
				})}
			</h2>

			{result.found_items.length > EMPTY_ARRAY_LENGTH && (
				<section className={styles["panel__section"]}>
					<h3 className={styles["panel__section-title"]}>
						{t("games.findTheWrong.result.foundSection")}
					</h3>
					<ul className={styles["panel__list"]}>
						{result.found_items.map((item) => (
							<RevealRow item={item} key={item.id} />
						))}
					</ul>
				</section>
			)}

			{result.missed_items.length > EMPTY_ARRAY_LENGTH && (
				<section className={styles["panel__section"]}>
					<h3 className={styles["panel__section-title"]}>
						{t("games.findTheWrong.result.missedSection")}
					</h3>
					<ul className={styles["panel__list"]}>
						{result.missed_items.map((item) => (
							<RevealRow item={item} key={item.id} muted />
						))}
					</ul>
				</section>
			)}

			<div className={styles["panel__actions"]}>
				<Button fullWidth onClick={onReview} size="lg" variant="secondary">
					{t("games.actions.review")}
				</Button>
				<Button fullWidth onClick={onPlayAgain} size="lg">
					{t("games.findTheWrong.actions.playAgain")}
				</Button>
			</div>
		</div>
	);
};

export { FindTheWrongResultPanel };
