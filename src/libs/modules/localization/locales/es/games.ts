const games = {
	content: {
		invalidId: "ID de juego no válido o ausente.",
		notFound: "Contenido del juego no encontrado.",
	},
	level: {
		invalidId: "ID de juego no válido o ausente.",
		noLevel: "Ningún nivel seleccionado.",
		notFound: "Contenido del juego no encontrado.",
		title: "Nivel {{levelId}} — {{title}}",
		unsupportedType: "Tipo de juego no compatible: {{key}}",
	},
	levels: {
		empty: "No hay niveles disponibles en este momento.",
		error: "Error al cargar los niveles. Por favor, inténtalo de nuevo.",
		title: "Selecciona un nivel para el juego {{title}}",
	},
	selection: {
		empty: "No hay juegos disponibles en este momento.",
		title: "Elige un juego",
	},
	trueFalse: {
		actions: {
			back: "Volver a los niveles",
			markFalse: "Marcar como falso",
			markTrue: "Marcar como verdadero",
			reset: "Reiniciar nivel",
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
		submit: "Comprobar respuestas",
	},
};

export { games };
