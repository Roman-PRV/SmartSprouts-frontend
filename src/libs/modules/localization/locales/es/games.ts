const games = {
	actions: {
		back: "Volver a los niveles",
		backToResults: "Volver a resultados",
		reset: "Reiniciar",
		review: "Ver marcas",
		submit: "Comprobar",
	},
	arithmetic: {
		actions: {
			playAgain: "Jugar de nuevo",
		},
		error: {
			load: "No se pudo cargar el nivel. Inténtalo de nuevo.",
			notFound: "Nivel no encontrado.",
			submit: "No se pudieron enviar las respuestas. Inténtalo de nuevo.",
		},
		result: {
			expected: "Debería ser {{value}}",
			score: "{{score}} de {{total}} correctas",
		},
	},
	content: {
		errorTitle: "Error",
		invalidId: "ID de juego no válido o ausente.",
		loadError: "No se pudo cargar el juego. Inténtalo de nuevo.",
		notFound: "Contenido del juego no encontrado.",
	},
	findTheWrong: {
		actions: {
			playAgain: "Jugar de nuevo",
		},
		counter: "Usadas {{used}} de {{limit}}",
		error: {
			load: "Error al cargar el nivel. Por favor, inténtalo de nuevo.",
			noImage: "Este nivel no tiene imagen.",
			notFound: "Nivel no encontrado.",
			submit: "Error al enviar tu intento. Por favor, inténtalo de nuevo.",
		},
		hint: {
			circle: "Rodea los objetos incorrectos.",
			marker: "Toca los objetos incorrectos.",
		},
		mode: {
			circle: "Rodear",
			label: "Modo de juego",
			marker: "Tocar",
		},
		notice: {
			openStroke: "Cierra el contorno alrededor del objeto para que cuente.",
		},
		result: {
			foundSection: "Encontrados",
			missedSection: "Omitidos",
			scoreSummary: "{{score}} de {{total}} encontrados",
		},
	},
	level: {
		errorTitle: "Error",
		invalidId: "ID de nivel no válido o ausente.",
		noLevel: "Ningún nivel seleccionado.",
		notFound: "Contenido del juego no encontrado.",
		title: "Nivel {{levelId}} — {{title}}",
		unsupportedType: "Tipo de juego no compatible: {{key}}",
	},
	levels: {
		empty: "No hay niveles disponibles en este momento.",
		error: "Error al cargar los niveles. Por favor, inténtalo de nuevo.",
		progress: {
			mastered: "Dominado",
			notPerfect: "Jugado, pero aún no perfecto",
			notStarted: "Aún sin jugar",
		},
		title: "Selecciona un nivel para el juego {{title}}",
	},
	selection: {
		categories: {
			all: "Todos",
		},
		categoriesNavLabel: "Filtrar juegos por categoría",
		categoryTitle: "Juegos de {{category}}",
		empty: "No hay juegos disponibles en este momento.",
		error: "Error al cargar los juegos. Por favor, inténtalo de nuevo.",
		title: "Elige un juego",
	},
	trueFalse: {
		actions: {
			markFalse: "Marcar como falso",
			markTrue: "Marcar como verdadero",
		},
		error: {
			check: "Error al comprobar las respuestas. Inténtalo de nuevo.",
			load: "Error al cargar el nivel. Por favor, inténtalo de nuevo.",
			notFound: "Nivel no encontrado.",
		},
		loading: {
			check: "Comprobando...",
			load: "Cargando nivel...",
		},
		result: {
			correct: "Correcto",
			incorrect: "Incorrecto",
		},
	},
};

export { games };
