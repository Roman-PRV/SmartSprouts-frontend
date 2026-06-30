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
			confirmBody: "Level “{{title}}” and all its items will be permanently removed.",
			confirmCta: "Delete",
			confirmTitle: "Delete level",
			error: "Failed to delete the level. Please try again.",
			success: "Level deleted.",
		},
		editor: {
			addNewItem: "Add new item",
			drawingHint: "Click to add vertices. {{count}} placed (need at least 3).",
			emptyItems: "No items yet. Use \"Add new item\" to create the first one.",
			fields: {
				image: {
					currentFile: "Current file: {{name}}",
					hint: "JPEG, PNG or WebP, up to {{maxMb}} MB",
					label: "Background image (optional)",
				},
			},
			finishPolygon: "Finish polygon",
			itemsHeading: "Items",
			loadError: "Failed to load the level. Please try again.",
			noImageHint: "Upload a background image to start drawing items.",
			retry: "Retry",
			saveLevel: "Save level",
			title: "Edit level",
			updateError: "Failed to save the level. Please try again.",
			updateSuccess: "Level updated.",
		},
		emptyList: "No levels yet. Create the first one to get started.",
		item: {
			actions: {
				cancelDrawing: "Cancel drawing",
				delete: "Delete",
				edit: "Edit",
				save: "Save",
			},
			create: {
				cancel: "Cancel",
				error: "Failed to create the item. Please try again.",
				modalTitle: "Create item",
				submit: "Create item",
				success: "Item created.",
			},
			delete: {
				cancel: "Cancel",
				confirmBody: "Item “{{name}}” will be permanently removed.",
				confirmCta: "Delete",
				confirmTitle: "Delete item",
				error: "Failed to delete the item. Please try again.",
				success: "Item deleted.",
			},
			fields: {
				explanation: {
					en: { label: "Explanation (English)" },
					es: { label: "Explanation (Spanish)" },
					uk: { label: "Explanation (Ukrainian)" },
				},
				name: {
					en: { label: "Name (English)" },
					es: { label: "Name (Spanish)" },
					uk: { label: "Name (Ukrainian)" },
				},
			},
			update: {
				error: "Failed to update the item. Please try again.",
				success: "Item updated.",
			},
			validation: {
				nameRequired: "Name is required.",
				polygonMinPoints: "Polygon needs at least 3 points.",
				tooLong: "Up to {{max}} characters allowed.",
			},
		},
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
		exitToApp: "Exit admin panel",
		loggedInAs: "Logged in as {{name}}",
		title: "Admin",
	},
	nav: {
		findTheWrong: "Find the wrong",
		gameUnavailable: "This game is not available right now",
		loadError: "Failed to load games. Please try again.",
		retry: "Retry",
		trueFalseImage: "True/False (image)",
		trueFalseText: "True/False (text)",
	},
	trueFalse: {
		audio: {
			error: "Failed to start audio regeneration. Please try again.",
			fresh: "Up to date",
			generating: "Generating…",
			regenerate: "Regenerate",
			regenerateLabel: "Regenerate {{field}} audio ({{locale}})",
		},
		editor: {
			loadError: "Failed to load the level. Please try again.",
			title: "Edit level",
		},
		level: {
			audio: {
				text: "Body audio",
				title: "Title audio",
			},
			create: {
				cancel: "Cancel",
				error: "Failed to create the level. Please try again.",
				modalTitle: "Create level",
				submit: "Create level",
				success: "Level created.",
			},
			delete: {
				cancel: "Cancel",
				confirmBody: "Level “{{title}}” and all its statements will be permanently removed.",
				confirmCta: "Delete",
				confirmTitle: "Delete level",
				error: "Failed to delete the level. Please try again.",
				success: "Level deleted.",
			},
			edit: {
				error: "Failed to save the level. Please try again.",
				submit: "Save level",
				success: "Level updated.",
			},
			fields: {
				image: {
					hint: "JPEG, PNG or WebP, up to {{maxMb}} MB",
					label: "Cover image",
				},
				text: {
					en: "Body text (English)",
					es: "Body text (Spanish)",
					uk: "Body text (Ukrainian)",
				},
				title: {
					en: "Title (English)",
					es: "Title (Spanish)",
					uk: "Title (Ukrainian)",
				},
			},
		},
		list: {
			columns: {
				actions: "Actions",
				id: "ID",
				statementsCount: "Statements",
				title: "Title",
			},
			create: "Create level",
			delete: "Delete",
			edit: "Edit",
			empty: "No levels yet. Create the first one to get started.",
			loadError: "Failed to load levels. Please try again.",
			retry: "Retry",
			title: "True/False levels",
		},
		statement: {
			audio: {
				explanation: "Explanation audio",
				statement: "Statement audio",
			},
			badge: {
				false: "False",
				true: "True",
			},
			create: {
				cancel: "Cancel",
				cta: "Add statement",
				error: "Failed to create the statement. Please try again.",
				modalTitle: "Add statement",
				submit: "Add statement",
				success: "Statement created.",
			},
			delete: {
				cancel: "Cancel",
				confirmBody: "Statement “{{text}}” will be permanently removed.",
				confirmCta: "Delete",
				confirmTitle: "Delete statement",
				error: "Failed to delete the statement. Please try again.",
				success: "Statement deleted.",
			},
			edit: {
				cancel: "Cancel",
				error: "Failed to update the statement. Please try again.",
				submit: "Save statement",
				success: "Statement updated.",
			},
			empty: "No statements yet. Add the first one.",
			fields: {
				explanation: {
					en: "Explanation (English)",
					es: "Explanation (Spanish)",
					uk: "Explanation (Ukrainian)",
				},
				isTrue: "Statement is true",
				statement: {
					en: "Statement (English)",
					es: "Statement (Spanish)",
					uk: "Statement (Ukrainian)",
				},
			},
			row: {
				delete: "Delete",
				edit: "Edit",
			},
			title: "Statements",
		},
		validation: {
			imageRequired: "Cover image is required.",
			imageSize: "Image must be {{maxMb}} MB or smaller.",
			imageType: "Image must be a JPEG, PNG or WebP file.",
			required: "This field is required.",
			tooLong: "This value is too long.",
		},
	},
	welcome: {
		description: "Pick a game in the sidebar to manage its levels.",
		title: "Administration",
	},
};

export { admin };
