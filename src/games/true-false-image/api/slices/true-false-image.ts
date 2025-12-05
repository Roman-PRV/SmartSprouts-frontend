import { checkAnswers, getLevelById } from "./true-false-image-actions";
import { actions } from "./true-false-image.slice";

const allActions = {
	...actions,
	checkAnswers,
	getLevelById,
};

export { allActions as actions };
export { reducer } from "./true-false-image.slice";
