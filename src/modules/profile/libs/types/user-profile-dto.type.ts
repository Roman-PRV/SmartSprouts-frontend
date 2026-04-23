type UserProfileDto = {
	email: string;
	name: string;
	stats: {
		completedLevels: number;
		correctAnswersPercentage: number;
		totalLevels: number;
		totalScore: number;
	};
};

export { type UserProfileDto };
