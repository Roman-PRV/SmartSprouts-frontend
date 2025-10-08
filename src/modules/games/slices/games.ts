import { getAllGames } from "./actions.js";
import { actions } from "./games.slice.js";

const allActions = {
	...actions,
	getAllGames,
};

export { allActions as actions };
export { reducer } from "./games.slice.js";
