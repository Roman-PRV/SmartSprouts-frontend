const admin = {
	errors: {
		gameNotFound: "Game not found",
		invalidGameId: "Invalid game id",
		invalidLevelId: "Invalid level id",
		unsupportedGame: "Admin is not available for this game ({{key}})",
	},
	findTheWrong: {
		create: {
			cancel: "Cancel",
			error: "Failed to create the level. Please try again.",
			fields: {
				image: {
					hint: "JPEG, PNG or WebP, up to {{maxMb}} MB",
					label: "Background image",
				},
				title: {
					en: {
						label: "Title (English)",
						placeholder: "Find the wrong object",
					},
					es: {
						label: "Title (Spanish)",
						placeholder: "Encuentra el objeto incorrecto",
					},
					uk: {
						label: "Title (Ukrainian)",
						placeholder: "Знайди хибне",
					},
				},
			},
			modalTitle: "Create level",
			submit: "Create level",
			success: "Level created.",
			validation: {
				imageRequired: "Background image is required.",
				imageSize: "Image must be {{maxMb}} MB or smaller.",
				imageType: "Image must be a JPEG, PNG or WebP file.",
				required: "This field is required.",
				tooLong: "Up to {{max}} characters allowed.",
			},
		},
		delete: {
			cancel: "Cancel",
			confirmBody:
				"Level “{{title}}” and all its items will be permanently removed.",
			confirmCta: "Delete",
			confirmTitle: "Delete level",
			error: "Failed to delete the level. Please try again.",
			success: "Level deleted.",
		},
		emptyList: "No levels yet. Create the first one to get started.",
		list: {
			actions: {
				delete: "Delete",
				edit: "Edit",
			},
			columns: {
				actions: "Actions",
				id: "ID",
				image: "Image",
				itemsCount: "Items",
				title: "Title",
			},
			create: "Create level",
			loadError: "Failed to load levels. Please try again.",
			retry: "Retry",
			title: "Find the wrong levels",
		},
		pagination: {
			next: "Next",
			previous: "Previous",
			status: "Page {{page}} of {{total}}",
		},
	},
	header: {
		loggedInAs: "Logged in as {{name}}",
		title: "Admin",
	},
	nav: {
		findTheWrong: "Find the wrong",
		gameUnavailable: "This game is not available right now",
		loadError: "Failed to load games. Please try again.",
		retry: "Retry",
	},
	welcome: {
		description: "Pick a game in the sidebar to manage its levels.",
		title: "Administration",
	},
};

export { admin };
