import { type TrueFalseGameResultDto } from "~/games/true-false-game/libs/types/types";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	disabled: boolean;
	onSelect: (statementId: number, value: boolean) => void;
	result?: TrueFalseGameResultDto | undefined;
	selected?: boolean | undefined;
	statement: { id: number; statement: string };
};

const TrueFalseStatement: React.FC<Properties> = ({
	disabled,
	onSelect,
	result,
	selected,
	statement,
}) => {
	const handleTrueClick = useCallback(() => {
		onSelect(statement.id, true);
	}, [onSelect, statement.id]);

	const handleFalseClick = useCallback(() => {
		onSelect(statement.id, false);
	}, [onSelect, statement.id]);

	return (
		<div className={getValidClassNames(styles["statement"])}>
			<p className={getValidClassNames(styles["statement__text"])}>{statement.statement}</p>

			<div className={getValidClassNames(styles["statement__buttons"])}>
				<button
					aria-label="Mark as true"
					className={getValidClassNames(
						selected === true
							? styles["statement__button--selected-true"]
							: styles["statement__button"]
					)}
					disabled={disabled}
					onClick={handleTrueClick}
				>
					✅
				</button>

				<button
					aria-label="Mark as false"
					className={getValidClassNames(
						selected === false
							? styles["statement__button--selected-false"]
							: styles["statement__button"]
					)}
					disabled={disabled}
					onClick={handleFalseClick}
				>
					❌
				</button>
			</div>

			{result && (
				<div
					className={getValidClassNames(
						styles["statement__result"],
						result.correct
							? styles["statement__result--correct"]
							: styles["statement__result--incorrect"]
					)}
				>
					{result.correct ? "Correct" : "Incorrect"}: {result.explanation}
				</div>
			)}
		</div>
	);
};

export { TrueFalseStatement };
