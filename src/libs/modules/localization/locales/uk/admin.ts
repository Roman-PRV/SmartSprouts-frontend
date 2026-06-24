const admin = {
	errors: {
		gameNotFound: "Гру не знайдено",
		invalidGameId: "Некоректний ідентифікатор гри",
		invalidLevelId: "Некоректний ідентифікатор рівня",
		unsupportedGame: "Адмін-панель недоступна для цієї гри ({{key}})",
	},
	findTheWrong: {
		create: {
			cancel: "Скасувати",
			error: "Не вдалося створити рівень. Спробуйте ще раз.",
			fields: {
				image: {
					hint: "JPEG, PNG або WebP, до {{maxMb}} МБ",
					label: "Фонове зображення",
				},
				title: {
					en: {
						label: "Назва (англійською)",
						placeholder: "Find the wrong object",
					},
					es: {
						label: "Назва (іспанською)",
						placeholder: "Encuentra el objeto incorrecto",
					},
					uk: {
						label: "Назва (українською)",
						placeholder: "Знайди хибне",
					},
				},
			},
			modalTitle: "Створення рівня",
			submit: "Створити рівень",
			success: "Рівень створено.",
			validation: {
				imageRequired: "Завантажте фонове зображення.",
				imageSize: "Розмір файлу не може перевищувати {{maxMb}} МБ.",
				imageType: "Дозволені формати: JPEG, PNG або WebP.",
				required: "Це поле обовʼязкове.",
				tooLong: "Максимум {{max}} символів.",
			},
		},
		delete: {
			cancel: "Скасувати",
			confirmBody: "Рівень «{{title}}» та всі його обʼєкти буде остаточно видалено.",
			confirmCta: "Видалити",
			confirmTitle: "Видалення рівня",
			error: "Не вдалося видалити рівень. Спробуйте ще раз.",
			success: "Рівень видалено.",
		},
		editor: {
			addNewItem: "Додати обʼєкт",
			drawingHint: "Клікайте по зображенню, щоб додавати вершини. Поставлено: {{count}} (мінімум 3).",
			emptyItems: "Обʼєктів ще немає. Натисніть «Додати обʼєкт», щоб створити перший.",
			fields: {
				image: {
					currentFile: "Поточний файл: {{name}}",
					hint: "JPEG, PNG або WebP, до {{maxMb}} МБ",
					label: "Фонове зображення (опційно)",
				},
			},
			finishPolygon: "Завершити обʼєкт",
			itemsHeading: "Обʼєкти",
			loadError: "Не вдалося завантажити рівень. Спробуйте ще раз.",
			noImageHint: "Завантажте фонове зображення, щоб почати малювати обʼєкти.",
			retry: "Спробувати знову",
			saveLevel: "Зберегти рівень",
			title: "Редагування рівня",
			updateError: "Не вдалося зберегти рівень. Спробуйте ще раз.",
			updateSuccess: "Рівень оновлено.",
		},
		emptyList: "Рівнів ще немає. Створіть перший, щоб почати.",
		item: {
			actions: {
				cancelDrawing: "Скасувати малювання",
				delete: "Видалити",
				edit: "Редагувати",
				save: "Зберегти",
			},
			create: {
				cancel: "Скасувати",
				error: "Не вдалося створити обʼєкт. Спробуйте ще раз.",
				modalTitle: "Створення обʼєкта",
				submit: "Створити обʼєкт",
				success: "Обʼєкт створено.",
			},
			delete: {
				cancel: "Скасувати",
				confirmBody: "Обʼєкт «{{name}}» буде остаточно видалено.",
				confirmCta: "Видалити",
				confirmTitle: "Видалення обʼєкта",
				error: "Не вдалося видалити обʼєкт. Спробуйте ще раз.",
				success: "Обʼєкт видалено.",
			},
			fields: {
				explanation: {
					en: { label: "Пояснення (англійською)" },
					es: { label: "Пояснення (іспанською)" },
					uk: { label: "Пояснення (українською)" },
				},
				name: {
					en: { label: "Назва (англійською)" },
					es: { label: "Назва (іспанською)" },
					uk: { label: "Назва (українською)" },
				},
			},
			update: {
				error: "Не вдалося оновити обʼєкт. Спробуйте ще раз.",
				success: "Обʼєкт оновлено.",
			},
			validation: {
				nameRequired: "Поле «Назва» обовʼязкове.",
				polygonMinPoints: "Багатокутник має містити щонайменше 3 точки.",
				tooLong: "Максимум {{max}} символів.",
			},
		},
		list: {
			actions: {
				delete: "Видалити",
				edit: "Редагувати",
			},
			columns: {
				actions: "Дії",
				id: "ID",
				image: "Зображення",
				itemsCount: "Обʼєктів",
				title: "Назва",
			},
			create: "Створити рівень",
			loadError: "Не вдалося завантажити рівні. Спробуйте ще раз.",
			retry: "Спробувати знову",
			title: "Рівні «Знайди хибне»",
		},
		pagination: {
			next: "Далі",
			previous: "Назад",
			status: "Сторінка {{page}} з {{total}}",
		},
	},
	header: {
		exitToApp: "Вийти з адмінки",
		loggedInAs: "Ви увійшли як {{name}}",
		title: "Адміністрування",
	},
	nav: {
		findTheWrong: "Знайди хибне",
		gameUnavailable: "Гра наразі недоступна",
		loadError: "Не вдалося завантажити ігри. Спробуйте ще раз.",
		retry: "Спробувати знову",
	},
	welcome: {
		description: "Оберіть гру у бічному меню, щоб переглянути її рівні.",
		title: "Адміністрування",
	},
};

export { admin };
