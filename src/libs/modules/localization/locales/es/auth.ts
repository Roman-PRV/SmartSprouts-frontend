const auth = {
	consent: {
		label:
			"Confirmo que tengo 18 años o más y que soy el padre, la madre o el tutor legal del niño; acepto los <0>Términos de Servicio</0> y he leído la <1>Política de Privacidad</1>",
	},
	consentGate: {
		button: "Continuar",
		description:
			"Necesitamos tu confirmación antes de continuar: según nuestros registros, aún no has aceptado la versión vigente de nuestros documentos legales.",
		error: "No se pudo guardar tu confirmación. Por favor, inténtalo de nuevo.",
		title: "Un Paso Más",
	},
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
		googleErrors: {
			redirectFailed: "No se pudo iniciar el inicio de sesión con Google. Inténtalo de nuevo.",
		},
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
