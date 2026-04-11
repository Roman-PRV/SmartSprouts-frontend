import {
	type TrueFalseGameResultDto,
	type TrueFalseGameStatementDto,
} from "~/games/true-false-game/libs/types/types";
import { AudioPlayButton } from "~/libs/components/components";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useTranslation } from "~/libs/hooks/hooks";

import styles from "./styles.module.css";

type Properties = {
	disabled: boolean;
	onSelect: (statementId: number, value: boolean) => void;
	result?: TrueFalseGameResultDto | undefined;
	selected?: boolean | undefined;
	statement: TrueFalseGameStatementDto;
};

const TrueFalseStatement: React.FC<Properties> = ({
	disabled,
	onSelect,
	result,
	selected,
	statement,
}) => {
	const { t } = useTranslation();

	const handleTrueClick = useCallback(() => {
		onSelect(statement.id, true);
	}, [onSelect, statement.id]);

	const handleFalseClick = useCallback(() => {
		onSelect(statement.id, false);
	}, [onSelect, statement.id]);

	return (
		<div className={getValidClassNames(styles["statement"])}>
			<div className={styles["statement__text-container"]}>
				<p className={getValidClassNames(styles["statement__text"])}>{statement.statement}</p>
				<AudioPlayButton url={statement.statement_audio_url} />
			</div>

			<div className={getValidClassNames(styles["statement__buttons"])}>
				<button
					aria-label={t("games.trueFalse.actions.markTrue")}
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
					aria-label={t("games.trueFalse.actions.markFalse")}
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
				<div className={styles["statement__result-container"]}>
					<div
						className={getValidClassNames(
							styles["statement__result"],
							result.correct
								? styles["statement__result--correct"]
								: styles["statement__result--incorrect"]
						)}
					>
						{result.correct
							? t("games.trueFalse.result.correct")
							: t("games.trueFalse.result.incorrect")}
						: {result.explanation}
					</div>
					<AudioPlayButton url={statement.explanation_audio_url} />
				</div>
			)}
		</div>
	);
};

export { TrueFalseStatement };
