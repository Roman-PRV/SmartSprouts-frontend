import { checkAnswers, getLevelById } from "./true-false-game-actions";
import { actions } from "./true-false-game.slice";

const allActions = {
	...actions,
	checkAnswers,
	getLevelById,
};

export { allActions as actions };
export { reducer } from "./true-false-game.slice";
