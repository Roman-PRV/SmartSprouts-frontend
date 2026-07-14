const validation = {
	acceptedTerms: {
		required: "Debes confirmarlo para crear una cuenta",
	},
	email: {
		invalid: "Por favor, introduce un email válido",
		required: "El email es obligatorio",
	},
	error: "Error de validación",
	name: {
		minLength: "El nombre debe tener al menos {{min}} caracteres",
		required: "El nombre es obligatorio",
	},
	password: {
		minLength: "La contraseña debe tener al menos {{min}} caracteres",
		mustBeNew: "La nueva contraseña debe ser diferente de la actual",
		mustContainLetter: "La contraseña debe contener al menos una letra",
		mustContainLowercase: "La contraseña debe contener al menos una letra minúscula",
		mustContainNumber: "La contraseña debe contener al menos un número",
		mustContainUppercase: "La contraseña debe contener al menos una letra mayúscula",
		required: "La contraseña es obligatoria",
	},
	passwordConfirmation: {
		mustMatch: "Las contraseñas deben coincidir",
		required: "La confirmación de contraseña es obligatoria",
	},
};

export { validation };
