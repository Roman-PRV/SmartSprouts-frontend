import { getAllGames, getById } from "./actions.js";
import { actions } from "./games.slice.js";

const allActions = {
	...actions,
	getAllGames,
	getById,
};

export { allActions as actions };
export { reducer } from "./games.slice.js";
