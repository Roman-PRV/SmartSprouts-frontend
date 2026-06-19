import { type CanvasCoordsApi, type Stroke } from "~/libs/types/types";

import { StrokeLine } from "./stroke-line";

type Properties = {
	coords: CanvasCoordsApi;
	highlightClosed?: boolean;
	readOnly?: boolean;
	strokes: Stroke[];
};

const StrokeLayer: React.FC<Properties> = ({
	coords,
	highlightClosed = false,
	readOnly = false,
	strokes,
}) => {
	return (
		<>
			{strokes.map((stroke) => (
				<StrokeLine
					coords={coords}
					highlightClosed={highlightClosed}
					key={stroke.id}
					readOnly={readOnly}
					stroke={stroke}
				/>
			))}
		</>
	);
};

export { StrokeLayer };
