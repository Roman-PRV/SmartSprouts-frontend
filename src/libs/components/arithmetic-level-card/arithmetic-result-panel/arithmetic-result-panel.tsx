import {
	type ArithmeticAttemptResponseDto,
	type ArithmeticAttemptResultDto,
} from "~/games/arithmetic/arithmetic";
import { Button } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	onPlayAgain: () => void;
	operator: string;
	result: ArithmeticAttemptResponseDto;
};

const ArithmeticResultPanel: React.FC<Properties> = ({ onPlayAgain, operator, result }) => {
	const { t } = useTranslation();

	const score = result.results.filter((entry) => entry.correct).length;
	const total = result.results.length;

	return (
		<div className={styles["panel"]}>
			<h2 className={styles["panel__score"]}>
				{t("games.arithmetic.result.score", { score, total })}
			</h2>

			<ul className={styles["panel__list"]}>
				{result.results.map((entry: ArithmeticAttemptResultDto) => (
					<li
						className={getValidClassNames(
							styles["row"],
							!entry.correct && styles["row--incorrect"]
						)}
						key={entry.equation_id}
					>
						<span className={styles["row__equation"]}>
							{entry.operand_a} {operator} {entry.operand_b} = {entry.given_answer}
						</span>
						<span
							aria-hidden
							className={getValidClassNames(
								styles["row__mark"],
								entry.correct ? styles["row__mark--correct"] : styles["row__mark--incorrect"]
							)}
						>
							{entry.correct ? "✓" : "✗"}
						</span>
						{!entry.correct && (
							<span className={styles["row__expected"]}>
								{t("games.arithmetic.result.expected", { value: entry.expected_answer })}
							</span>
						)}
					</li>
				))}
			</ul>

			<Button fullWidth onClick={onPlayAgain} size="lg">
				{t("games.arithmetic.actions.playAgain")}
			</Button>
		</div>
	);
};

export { ArithmeticResultPanel };
