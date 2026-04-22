type User = {
	analytics?: {
		completedLevels: number;
		correctAnswersPercentage: number;
		totalLevels: number;
	};
	email: string;
	id: number;
	name: string;
};

export { type User };
