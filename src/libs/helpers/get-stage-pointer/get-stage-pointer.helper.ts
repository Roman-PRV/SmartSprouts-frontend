import { type KonvaEventObject } from "konva/lib/Node";

import { type Point } from "~/libs/types/types";

const getStagePointer = (event: KonvaEventObject<unknown>): null | Point => {
	const position = event.target.getStage()?.getPointerPosition();

	return position ? [position.x, position.y] : null;
};

export { getStagePointer };
