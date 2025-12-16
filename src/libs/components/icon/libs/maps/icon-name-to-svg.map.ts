import ArrowRight from "~/assets/img/icons/arrow-right-icon.svg?react";
import BurgerMenu from "~/assets/img/icons/burger-menu.svg?react";
import Check from "~/assets/img/icons/check-icon.svg?react";
import CloseIcon from "~/assets/img/icons/close-icon.svg?react";
import Lock from "~/assets/img/icons/lock-icon.svg?react";
import Login from "~/assets/img/icons/login-icon.svg?react";
import Logout from "~/assets/img/icons/logout-icon.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
	arrowRight: ArrowRight,
	burgerMenu: BurgerMenu,
	check: Check,
	close: CloseIcon,
	lock: Lock,
	login: Login,
	logout: Logout,
};

export { iconNameToSvg };
