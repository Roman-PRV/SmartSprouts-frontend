import { memo, useMemo } from "react";

import { type CanvasCoordsApi, type Polygon } from "~/libs/types/types";

import { type FeedbackOverlay } from "../../libs/types/types";
import { PolygonLine } from "./polygon-line";

type Properties = {
	coords: CanvasCoordsApi;
	feedbackOverlay?: FeedbackOverlay[];
	polygons: Polygon[];
};

const PolygonOverlay: React.FC<Properties> = memo(({ coords, feedbackOverlay, polygons }) => {
	const matchedById = useMemo<Map<string, boolean>>(
		() => new Map(feedbackOverlay?.map((overlay) => [overlay.itemId, overlay.matched]) ?? []),
		[feedbackOverlay]
	);

	return (
		<>
			{polygons.map((polygon) => (
				<PolygonLine
					coords={coords}
					key={polygon.id}
					matched={matchedById.get(polygon.id) === true}
					polygon={polygon}
				/>
			))}
		</>
	);
});

PolygonOverlay.displayName = "PolygonOverlay";

export { PolygonOverlay };
