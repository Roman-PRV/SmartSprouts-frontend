const auth = {
	consentGate: {
		button: "Продовжити",
		description:
			"Перш ніж продовжити, потрібне ваше підтвердження: за нашими записами ви ще не приймали чинну версію наших юридичних документів.",
		error: "Не вдалося зберегти підтвердження. Спробуйте ще раз.",
		title: "Ще один крок",
	},
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
		googleErrors: {
			redirectFailed: "Не вдалося розпочати вхід через Google. Спробуйте ще раз.",
		},
		orDivider: "або",
		subtitle: "Увійдіть, щоб продовжити",
		title: "З поверненням",
	},
	register: {
		button: "Зареєструватися",
		consent: {
			label:
				"Підтверджую, що мені є 18 років і я батько, мати або законний опікун дитини; приймаю <0>Умови користування</0> та ознайомлений(-а) з <1>Політикою конфіденційності</1>",
		},
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
