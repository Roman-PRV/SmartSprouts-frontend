import { ADMIN_GAMES_REGISTRY } from "../constants/admin-games-registry.constants";
import { type AdminGameRegistration } from "../types/admin-game-registration.type";

const findAdminGameRegistration = (gameKey: string): AdminGameRegistration | null => {
	return ADMIN_GAMES_REGISTRY.find((entry) => entry.gameKey === gameKey) ?? null;
};

export { findAdminGameRegistration };
