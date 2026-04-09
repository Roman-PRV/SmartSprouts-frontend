const games = {
	content: {
		invalidId: "Invalid or missing game ID.",
		notFound: "Game content not found.",
	},
	level: {
		invalidId: "Invalid or missing game ID.",
		noLevel: "No level selected.",
		notFound: "Game content not found.",
		title: "Level {{levelId}} — {{title}}",
		unsupportedType: "Unsupported game type: {{key}}",
	},
	levels: {
		empty: "No levels available at the moment.",
		error: "Failed to load levels. Please try again.",
		title: "Select a level for the {{title}} game",
	},
	selection: {
		empty: "No games available at the moment.",
		title: "Choose a game",
	},
	trueFalse: {
		actions: {
			back: "Back to Levels",
			markFalse: "Mark as false",
			markTrue: "Mark as true",
			reset: "Reset Level",
		},
		error: {
			check: "Failed to check answers. Please try again.",
			load: "Error loading level. Please try again.",
			notFound: "Level not found.",
		},
		loading: {
			check: "Checking...",
			load: "Loading level...",
		},
		result: {
			correct: "Correct",
			incorrect: "Incorrect",
		},
		submit: "Check Answers",
	},
};

export { games };
