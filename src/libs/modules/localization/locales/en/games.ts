const games = {
	content: {
		errorTitle: "Error",
		invalidId: "Invalid or missing game ID.",
		loadError: "Failed to load the game. Please try again.",
		notFound: "Game content not found.",
	},
	findTheWrong: {
		actions: {
			back: "Back to levels",
			clear: "Clear",
			done: "Done",
			playAgain: "Play again",
		},
		counter: "Used {{used}} of {{limit}}",
		error: {
			load: "Failed to load the level. Please try again.",
			noImage: "This level has no image.",
			notFound: "Level not found.",
			submit: "Failed to submit your attempt. Please try again.",
		},
		hint: {
			circle: "Circle the wrong objects.",
			marker: "Tap the wrong objects.",
		},
		mode: {
			circle: "Circle",
			label: "Play mode",
			marker: "Tap",
		},
		result: {
			foundSection: "Found",
			missedSection: "Missed",
			scoreSummary: "{{score}} of {{total}} found",
		},
	},
	level: {
		errorTitle: "Error",
		invalidId: "Invalid or missing level ID.",
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
		error: "Failed to load games. Please try again.",
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
