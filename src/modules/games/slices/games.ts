import { getAllGames, getById, getLevelsList } from "./actions";
import { actions } from "./games.slice";

const allActions = {
	...actions,
	getAllGames,
	getById,
	getLevelsList,
};

export { allActions as actions };
export { reducer } from "./games.slice";
