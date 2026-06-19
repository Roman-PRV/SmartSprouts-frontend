import { type ValueOf } from "~/libs/types/types";

import { InteractionMode } from "../../enums/enums";

const INTERACTION_MODES = Object.values(InteractionMode);

const MODE_VALUE_SET = new Set<string>(INTERACTION_MODES);

/** Narrows an arbitrary string (URL param, DOM value) to a known interaction mode. */
const isInteractionMode = (value: string): value is ValueOf<typeof InteractionMode> =>
	MODE_VALUE_SET.has(value);

export { INTERACTION_MODES, isInteractionMode };
