const validation = {
	acceptedTerms: {
		required: "Потрібно підтвердити це, щоб створити акаунт",
	},
	deletionCode: {
		format: "Код — це 6 цифр із листа, який ми вам надіслали",
	},
	email: {
		invalid: "Будь ласка, введіть дійсний email",
		required: "Email обов'язковий",
	},
	error: "Помилка валідації",
	name: {
		minLength: "Ім'я повинно містити щонайменше {{min}} символів",
		required: "Ім'я обов'язкове",
	},
	password: {
		minLength: "Пароль повинен містити щонайменше {{min}} символів",
		mustBeNew: "Новий пароль не повинен збігатися з поточним",
		mustContainLetter: "Пароль повинен містити щонайменше одну літеру",
		mustContainLowercase: "Пароль повинен містити щонайменше одну маленьку літеру",
		mustContainNumber: "Пароль повинен містити щонайменше одну цифру",
		mustContainUppercase: "Пароль повинен містити щонайменше одну велику літеру",
		required: "Пароль обов'язковий",
	},
	passwordConfirmation: {
		mustMatch: "Паролі повинні збігатися",
		required: "Підтвердження пароля обов'язкове",
	},
};

export { validation };
