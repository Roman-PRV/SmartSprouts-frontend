import { getAllGames, getById, getLevelsList } from "./actions.js";
import { actions } from "./games.slice.js";

const allActions = {
	...actions,
	getAllGames,
	getById,
	getLevelsList,
};

export { allActions as actions };
export { reducer } from "./games.slice.js";
