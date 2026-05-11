const auth = {
	googleCallback: {
		errors: {
			authFailed: "Не вдалося авторизуватись через Google. Спробуйте ще раз.",
			invalidAccount: "Акаунт Google не містить необхідних даних.",
			invalidState: "Сесія авторизації застаріла. Спробуйте ще раз.",
		},
		loading: "Завершуємо вхід…",
	},
	login: {
		button: "Увійти",
		fields: {
			email: {
				label: "Email",
				placeholder: "your@email.com",
			},
			password: {
				label: "Пароль",
				placeholder: "Введіть пароль",
			},
		},
		footerLinkText: "Зареєструватися",
		footerText: "Немає облікового запису?",
		googleButton: "Увійти через Google",
		orDivider: "або",
		subtitle: "Увійдіть, щоб продовжити",
		title: "З поверненням",
	},
	register: {
		button: "Зареєструватися",
		fields: {
			confirmPassword: {
				label: "Підтвердіть пароль",
				placeholder: "Підтвердіть пароль",
			},
			email: {
				label: "Email",
				placeholder: "your@email.com",
			},
			name: {
				label: "Ім'я",
				placeholder: "Ваше ім'я",
			},
			password: {
				label: "Пароль",
				placeholder: "Введіть пароль",
			},
		},
		footerLinkText: "Увійти",
		footerText: "Вже маєте акаунт?",
		subtitle: "Зареєструйтеся, щоб розпочати",
		title: "Створити акаунт",
	},
};

export { auth };
