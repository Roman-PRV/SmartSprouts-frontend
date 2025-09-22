import { type IconName } from "~/libs/types/types.js";

import { iconNameToSvg } from "./libs/maps/maps.js";

type Properties = {
	className?: string | undefined;
	color?: string | undefined;
	name: IconName;
};

const Icon: React.FC<Properties> = ({ className, color, name }: Properties) => {
	const Icon = iconNameToSvg[name];

	return <Icon className={className} color={color} />;
};

export { Icon };
