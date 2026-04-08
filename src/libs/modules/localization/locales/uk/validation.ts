const validation = {
	email: {
		invalid: "Будь ласка, введіть дійсний email",
		required: "Email обов'язковий",
	},
	name: {
		minLength: "Ім'я повинно містити щонайменше {{min}} символів",
		required: "Ім'я обов'язкове",
	},
	password: {
		minLength: "Пароль повинен містити щонайменше {{min}} символів",
		mustContainLetter: "Пароль повинен містити щонайменше одну літеру",
		mustContainNumber: "Пароль повинен містити щонайменше одну цифру",
		required: "Пароль обов'язковий",
	},
	passwordConfirmation: {
		mustMatch: "Паролі повинні збігатися",
		required: "Підтвердження пароля обов'язкове",
	},
};

export { validation };
