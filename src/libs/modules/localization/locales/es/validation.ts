const validation = {
	email: {
		invalid: "Por favor, introduce un email válido",
		required: "El email es obligatorio",
	},
	name: {
		minLength: "El nombre debe tener al menos {{min}} caracteres",
		required: "El nombre es obligatorio",
	},
	password: {
		minLength: "La contraseña debe tener al menos {{min}} caracteres",
		mustContainLetter: "La contraseña debe contener al menos una letra",
		mustContainNumber: "La contraseña debe contener al menos un número",
		required: "La contraseña es obligatoria",
	},
	passwordConfirmation: {
		mustMatch: "Las contraseñas deben coincidir",
		required: "La confirmación de contraseña es obligatoria",
	},
};

export { validation };
