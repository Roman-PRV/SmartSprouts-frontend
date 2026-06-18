import { type Point } from "~/libs/types/types";

type Marker = {
	id: string;
	placedAtMs: number;
	point: Point;
};

export type { Marker };
