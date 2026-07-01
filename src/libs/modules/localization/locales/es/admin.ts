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
			confirmBody: "El nivel “{{title}}” y todos sus objetos se eliminarán de forma permanente.",
			confirmCta: "Eliminar",
			confirmTitle: "Eliminar nivel",
			error: "No se pudo eliminar el nivel. Inténtalo de nuevo.",
			success: "Nivel eliminado.",
		},
		editor: {
			addNewItem: "Añadir objeto",
			drawingHint: "Haz clic para añadir vértices. {{count}} colocados (mínimo 3).",
			emptyItems: "Aún no hay objetos. Usa \"Añadir objeto\" para crear el primero.",
			fields: {
				image: {
					currentFile: "Archivo actual: {{name}}",
					hint: "JPEG, PNG o WebP, hasta {{maxMb}} MB",
					label: "Imagen de fondo (opcional)",
				},
			},
			finishPolygon: "Finalizar objeto",
			itemsHeading: "Objetos",
			loadError: "No se pudo cargar el nivel. Inténtalo de nuevo.",
			noImageHint: "Sube una imagen de fondo para empezar a dibujar objetos.",
			retry: "Reintentar",
			saveLevel: "Guardar nivel",
			title: "Editar nivel",
			updateError: "No se pudo guardar el nivel. Inténtalo de nuevo.",
			updateSuccess: "Nivel actualizado.",
		},
		emptyList: "Aún no hay niveles. Crea el primero para comenzar.",
		item: {
			actions: {
				cancelDrawing: "Cancelar dibujo",
				delete: "Eliminar",
				edit: "Editar",
				save: "Guardar",
			},
			create: {
				cancel: "Cancelar",
				error: "No se pudo crear el objeto. Inténtalo de nuevo.",
				modalTitle: "Crear objeto",
				submit: "Crear objeto",
				success: "Objeto creado.",
			},
			delete: {
				cancel: "Cancelar",
				confirmBody: "El objeto “{{name}}” se eliminará de forma permanente.",
				confirmCta: "Eliminar",
				confirmTitle: "Eliminar objeto",
				error: "No se pudo eliminar el objeto. Inténtalo de nuevo.",
				success: "Objeto eliminado.",
			},
			fields: {
				explanation: {
					en: { label: "Explicación (inglés)" },
					es: { label: "Explicación (español)" },
					uk: { label: "Explicación (ucraniano)" },
				},
				name: {
					en: { label: "Nombre (inglés)" },
					es: { label: "Nombre (español)" },
					uk: { label: "Nombre (ucraniano)" },
				},
			},
			update: {
				error: "No se pudo actualizar el objeto. Inténtalo de nuevo.",
				success: "Objeto actualizado.",
			},
			validation: {
				nameRequired: "El nombre es obligatorio.",
				polygonMinPoints: "El polígono debe tener al menos 3 puntos.",
				tooLong: "Máximo {{max}} caracteres.",
			},
		},
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
		exitToApp: "Salir del panel",
		loggedInAs: "Conectado como {{name}}",
		title: "Administración",
	},
	nav: {
		findTheWrong: "Encuentra lo incorrecto",
		gameUnavailable: "Este juego no está disponible ahora",
		loadError: "No se pudieron cargar los juegos. Inténtalo de nuevo.",
		retry: "Reintentar",
		trueFalseImage: "Verdadero/Falso (imagen)",
		trueFalseText: "Verdadero/Falso (texto)",
	},
	trueFalse: {
		audio: {
			error: "No se pudo iniciar la regeneración del audio. Inténtalo de nuevo.",
			fresh: "Actualizado",
			generating: "Generando…",
			regenerate: "Regenerar",
			regenerateLabel: "Regenerar «{{field}}» ({{locale}})",
			timeout: "El audio aún se está generando. Vuelve a intentarlo en un momento.",
		},
		editor: {
			loadError: "No se pudo cargar el nivel. Inténtalo de nuevo.",
			title: "Editar nivel",
		},
		level: {
			audio: {
				text: "Audio del texto",
				title: "Audio del título",
			},
			create: {
				cancel: "Cancelar",
				error: "No se pudo crear el nivel. Inténtalo de nuevo.",
				modalTitle: "Crear nivel",
				submit: "Crear nivel",
				success: "Nivel creado.",
			},
			delete: {
				cancel: "Cancelar",
				confirmBody:
					"El nivel «{{title}}» y todas sus afirmaciones se eliminarán de forma permanente.",
				confirmCta: "Eliminar",
				confirmTitle: "Eliminar nivel",
				error: "No se pudo eliminar el nivel. Inténtalo de nuevo.",
				success: "Nivel eliminado.",
			},
			edit: {
				error: "No se pudo guardar el nivel. Inténtalo de nuevo.",
				submit: "Guardar nivel",
				success: "Nivel actualizado.",
			},
			fields: {
				image: {
					currentFile: "Archivo actual: {{name}}",
					hint: "JPEG, PNG o WebP, hasta {{maxMb}} MB",
					label: "Imagen de portada",
					previewAlt: "Imagen de portada actual",
				},
				text: {
					en: "Texto (inglés)",
					es: "Texto (español)",
					uk: "Texto (ucraniano)",
				},
				title: {
					en: "Título (inglés)",
					es: "Título (español)",
					uk: "Título (ucraniano)",
				},
			},
		},
		list: {
			columns: {
				actions: "Acciones",
				id: "ID",
				image: "Imagen",
				statementsCount: "Afirmaciones",
				title: "Título",
			},
			create: "Crear nivel",
			delete: "Eliminar",
			edit: "Editar",
			empty: "Aún no hay niveles. Crea el primero para empezar.",
			loadError: "No se pudieron cargar los niveles. Inténtalo de nuevo.",
			retry: "Reintentar",
			title: "Niveles Verdadero/Falso",
		},
		statement: {
			audio: {
				explanation: "Audio de la explicación",
				statement: "Audio de la afirmación",
			},
			badge: {
				false: "Falso",
				true: "Verdadero",
			},
			create: {
				cancel: "Cancelar",
				cta: "Añadir afirmación",
				error: "No se pudo crear la afirmación. Inténtalo de nuevo.",
				modalTitle: "Añadir afirmación",
				submit: "Añadir afirmación",
				success: "Afirmación creada.",
			},
			delete: {
				cancel: "Cancelar",
				confirmBody: "La afirmación «{{text}}» se eliminará de forma permanente.",
				confirmCta: "Eliminar",
				confirmTitle: "Eliminar afirmación",
				error: "No se pudo eliminar la afirmación. Inténtalo de nuevo.",
				success: "Afirmación eliminada.",
			},
			edit: {
				cancel: "Cancelar",
				error: "No se pudo actualizar la afirmación. Inténtalo de nuevo.",
				submit: "Guardar afirmación",
				success: "Afirmación actualizada.",
			},
			empty: "Aún no hay afirmaciones. Añade la primera.",
			fields: {
				explanation: {
					en: "Explicación (inglés)",
					es: "Explicación (español)",
					uk: "Explicación (ucraniano)",
				},
				isTrue: "La afirmación es verdadera",
				statement: {
					en: "Afirmación (inglés)",
					es: "Afirmación (español)",
					uk: "Afirmación (ucraniano)",
				},
			},
			row: {
				delete: "Eliminar",
				edit: "Editar",
			},
			title: "Afirmaciones",
		},
		validation: {
			imageRequired: "La imagen de portada es obligatoria.",
			imageSize: "La imagen debe pesar {{maxMb}} MB o menos.",
			imageType: "La imagen debe ser un archivo JPEG, PNG o WebP.",
			required: "Este campo es obligatorio.",
			tooLong: "Este valor es demasiado largo.",
		},
	},
	welcome: {
		description: "Elige un juego en la barra lateral para gestionar sus niveles.",
		title: "Administración",
	},
};

export { admin };
