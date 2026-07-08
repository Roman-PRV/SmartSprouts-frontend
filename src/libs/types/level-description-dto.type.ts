type LevelDescriptionDto = {
	id: string;
	image_url: string;
	progress: LevelProgress;
	title: string;
};

type LevelProgress = "mastered" | "not_perfect" | "not_started";

export type { LevelDescriptionDto, LevelProgress };
