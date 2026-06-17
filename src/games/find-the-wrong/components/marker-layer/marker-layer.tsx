import { type CanvasCoordsApi } from "~/libs/types/types";

import { type Marker } from "../../libs/types/types";
import { MarkerX } from "./marker-x";

type Properties = {
	coords: CanvasCoordsApi;
	markers: Marker[];
};

const MarkerLayer: React.FC<Properties> = ({ coords, markers }) => {
	return (
		<>
			{markers.map((marker) => (
				<MarkerX coords={coords} key={marker.id} marker={marker} />
			))}
		</>
	);
};

export { MarkerLayer };
