const games = {
	content: {
		invalidId: "Invalid or missing game ID.",
		loading: "Loading game content...",
		notFound: "Game content not found.",
	},
	level: {
		invalidId: "Invalid or missing game ID.",
		loading: "Loading game content...",
		noLevel: "No level selected.",
		notFound: "Game content not found.",
		title: "Level {{levelId}} — {{title}}",
		unsupportedType: "Unsupported game type: {{key}}",
	},
	levels: {
		empty: "No levels available at the moment.",
		error: "Failed to load levels. Please try again.",
		loading: "Loading levels...",
		title: "Select a level for the {{title}} game",
	},
	selection: {
		empty: "No games available at the moment.",
		title: "Choose a game",
	},
	trueFalse: {
		actions: {
			back: "Back to Levels",
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
		submit: "Check Answers",
	},
};

export { games };
