import { getLevelById, submitAttempt } from "./arithmetic-game-actions";
import { actions } from "./arithmetic-game.slice";

const allActions = {
	...actions,
	getLevelById,
	submitAttempt,
};

export { allActions as actions };
export { reducer } from "./arithmetic-game.slice";
