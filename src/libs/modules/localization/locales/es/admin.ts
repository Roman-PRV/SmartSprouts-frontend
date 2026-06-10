const admin = {
	errors: {
		gameNotFound: "Juego no encontrado",
		invalidGameId: "Identificador de juego no válido",
		invalidLevelId: "Identificador de nivel no válido",
		unsupportedGame: "La administración no está disponible para este juego ({{key}})",
	},
	findTheWrong: {
		create: {
			cancel: "Cancelar",
			error: "No se pudo crear el nivel. Inténtalo de nuevo.",
			fields: {
				image: {
					hint: "JPEG, PNG o WebP, hasta {{maxMb}} MB",
					label: "Imagen de fondo",
				},
				title: {
					en: {
						label: "Título (inglés)",
						placeholder: "Find the wrong object",
					},
					es: {
						label: "Título (español)",
						placeholder: "Encuentra el objeto incorrecto",
					},
					uk: {
						label: "Título (ucraniano)",
						placeholder: "Знайди хибне",
					},
				},
			},
			modalTitle: "Crear nivel",
			submit: "Crear nivel",
			success: "Nivel creado.",
			validation: {
				imageRequired: "La imagen de fondo es obligatoria.",
				imageSize: "El archivo no puede superar los {{maxMb}} MB.",
				imageType: "Formatos permitidos: JPEG, PNG o WebP.",
				required: "Este campo es obligatorio.",
				tooLong: "Máximo {{max}} caracteres.",
			},
		},
		delete: {
			cancel: "Cancelar",
			confirmBody:
				"El nivel “{{title}}” y todos sus objetos se eliminarán de forma permanente.",
			confirmCta: "Eliminar",
			confirmTitle: "Eliminar nivel",
			error: "No se pudo eliminar el nivel. Inténtalo de nuevo.",
			success: "Nivel eliminado.",
		},
		emptyList: "Aún no hay niveles. Crea el primero para comenzar.",
		list: {
			actions: {
				delete: "Eliminar",
				edit: "Editar",
			},
			columns: {
				actions: "Acciones",
				id: "ID",
				image: "Imagen",
				itemsCount: "Objetos",
				title: "Título",
			},
			create: "Crear nivel",
			loadError: "No se pudieron cargar los niveles. Inténtalo de nuevo.",
			retry: "Reintentar",
			title: "Niveles de Encuentra lo incorrecto",
		},
		pagination: {
			next: "Siguiente",
			previous: "Anterior",
			status: "Página {{page}} de {{total}}",
		},
	},
	header: {
		loggedInAs: "Conectado como {{name}}",
		title: "Administración",
	},
	nav: {
		findTheWrong: "Encuentra lo incorrecto",
		gameUnavailable: "Este juego no está disponible ahora",
		loadError: "No se pudieron cargar los juegos. Inténtalo de nuevo.",
		retry: "Reintentar",
	},
	welcome: {
		description: "Elige un juego en la barra lateral para gestionar sus niveles.",
		title: "Administración",
	},
};

export { admin };
