import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import { type TrueFalseImageResultDto } from "../../types/types";
import styles from "./styles.module.css";

type Properties = {
    disabled: boolean;
    onSelect: (value: boolean) => void;
    result?: TrueFalseImageResultDto | undefined;
    selected?: boolean | undefined;
    statement: { id: number; statement: string };
};

const TrueFalseImageStatement: React.FC<Properties> = ({
    disabled,
    onSelect,
    result,
    selected,
    statement,
}) => {
    const handleTrueClick = useCallback(() => {
        onSelect(true);
    }, [onSelect]);

    const handleFalseClick = useCallback(() => {
        onSelect(false);
    }, [onSelect]);

    return (
        <div className={getValidClassNames(styles["statement"])}>
            <p className={getValidClassNames(styles["statement__text"])}>{statement.statement}</p>

            <div className={getValidClassNames(styles["statement__buttons"])}>
                <button
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

export { TrueFalseImageStatement };
