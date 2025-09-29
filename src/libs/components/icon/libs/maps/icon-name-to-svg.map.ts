import BurgerMenu from "~/assets/img/icons/burger-menu.svg?react";
import CloseIcon from "~/assets/img/icons/close-icon.svg?react";
import { type IconName } from "~/libs/types/types.js";

const iconNameToSvg: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
	burgerMenu: BurgerMenu,
	closeIcon: CloseIcon,
};

export { iconNameToSvg };
