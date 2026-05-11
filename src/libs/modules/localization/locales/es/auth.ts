const auth = {
	googleCallback: {
		errors: {
			authFailed: "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
			invalidAccount: "Tu cuenta de Google no contiene la información requerida.",
			invalidState: "Tu sesión de inicio de sesión ha caducado. Inténtalo de nuevo.",
		},
		loading: "Completando el inicio de sesión…",
	},
	login: {
		button: "Iniciar Sesión",
		fields: {
			email: {
				label: "Correo electrónico",
				placeholder: "your@email.com",
			},
			password: {
				label: "Contraseña",
				placeholder: "Ingresa tu contraseña",
			},
		},
		footerLinkText: "Registrarse",
		footerText: "¿No tienes una cuenta?",
		googleButton: "Iniciar sesión con Google",
		orDivider: "o",
		subtitle: "Inicia sesión para continuar",
		title: "Bienvenido de nuevo",
	},
	register: {
		button: "Registrarse",
		fields: {
			confirmPassword: {
				label: "Confirmar contraseña",
				placeholder: "Confirma tu contraseña",
			},
			email: {
				label: "Correo electrónico",
				placeholder: "your@email.com",
			},
			name: {
				label: "Nombre",
				placeholder: "Tu nombre",
			},
			password: {
				label: "Contraseña",
				placeholder: "Ingresa tu contraseña",
			},
		},
		footerLinkText: "Iniciar sesión",
		footerText: "¿Ya tienes una cuenta?",
		subtitle: "Regístrate para comenzar",
		title: "Crear cuenta",
	},
};

export { auth };
