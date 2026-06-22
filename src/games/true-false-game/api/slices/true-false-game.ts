import { getLevelById, submitAttempt } from "./true-false-game-actions";
import { actions } from "./true-false-game.slice";

const allActions = {
	...actions,
	getLevelById,
	submitAttempt,
};

export { allActions as actions };
export { reducer } from "./true-false-game.slice";
