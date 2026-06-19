import { getLevelById, submitAttempt } from "./find-the-wrong-game-actions";
import { actions } from "./find-the-wrong-game.slice";

const allActions = {
	...actions,
	getLevelById,
	submitAttempt,
};

export { allActions as actions };
export { reducer } from "./find-the-wrong-game.slice";
