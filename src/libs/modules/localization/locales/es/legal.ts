const legal = {
	draftBanner: "BORRADOR",
	languageNote:
		"Este documento está redactado en inglés, ucraniano y español. La versión en inglés prevalece legalmente; las traducciones se ofrecen por conveniencia.",
	links: {
		navLabel: "Documentos legales",
		privacy: "Política de Privacidad",
		terms: "Términos de Servicio",
	},
	privacy: {
		meta: "Versión: {{version}} · Fecha de entrada en vigor: {{effectiveDate}}",
		sections: [
			{
				heading: "1. Quiénes somos",
				paragraphs: [
					"SmartSprouts («nosotros») es un servicio de juegos educativos para niños, operado como proyecto independiente. Para cualquier pregunta o solicitud sobre tus datos personales, escríbenos a privacy@smartsprouts.pp.ua. Respondemos a las solicitudes sobre datos en un plazo de 30 días.",
				],
			},
			{
				heading: "2. Cómo funcionan las cuentas de SmartSprouts",
				paragraphs: [
					"Una cuenta de SmartSprouts la crea y la mantiene un adulto (18+, padre, madre o tutor legal) en nombre de un niño. No pedimos, ni queremos, el nombre del niño, su correo electrónico, su foto ni ningún otro identificador directo. El progreso de aprendizaje registrado mientras el niño juega se guarda bajo la cuenta del adulto y se procesa con la autorización del padre, madre o tutor, otorgada al registrarse.",
				],
			},
			{
				closing: [
					"No recopilamos identificadores publicitarios, datos de ubicación ni datos de seguimiento del comportamiento, y no vendemos ni compartimos datos personales con fines publicitarios.",
				],
				heading: "3. Qué datos recopilamos",
				items: [
					"Correo electrónico y nombre para mostrar: de ti, al registrarte, o de tu perfil de Google si inicias sesión con Google.",
					"Contraseña (almacenada solo como hash criptográfico): de ti, al registrarte.",
					"Identificador de la cuenta de Google y URL de la foto de perfil: de Google, si inicias sesión con Google.",
					"Progreso en los juegos (niveles jugados, puntuaciones, fechas): se crea durante el uso del juego.",
					"Registros de consentimiento (versión del documento, fecha, dirección IP, identificador del navegador): se crean cuando aceptas nuestros Términos.",
					"Registros del servidor (dirección IP, datos técnicos de las solicitudes): se crean automáticamente cuando la aplicación se comunica con nuestros servidores.",
				],
			},
			{
				heading: "4. Por qué procesamos los datos (fines y bases legales)",
				items: [
					"Para prestar el servicio: funcionamiento de tu cuenta, guardado del progreso, inicio de sesión. Base legal: ejecución de nuestro contrato contigo (RGPD, art. 6(1)(b)).",
					"Para mantener el servicio seguro: registros del servidor y diagnósticos técnicos. Base legal: nuestro interés legítimo en operar un servicio seguro (RGPD, art. 6(1)(f)).",
					"Para probar que el consentimiento fue otorgado: el registro creado al aceptar los Términos. Base legal: nuestras obligaciones legales y el interés legítimo en el establecimiento y la defensa de reclamaciones legales.",
				],
			},
			{
				heading: "5. Niños",
				paragraphs: [
					"SmartSprouts está diseñado para que los niños lo usen bajo la cuenta y con la autorización de un adulto. No recopilamos a sabiendas información personal directamente de los niños. Los identificadores que llegan a nuestros servidores mientras un niño juega (como el token de sesión o la dirección IP) se usan exclusivamente para operar el servicio, nunca para publicidad, seguimiento o elaboración de perfiles. El progreso de aprendizaje asociado a la cuenta se procesa sobre la base de la autorización del padre, madre o tutor otorgada al registrarse.",
				],
			},
			{
				heading: "6. Almacenamiento en tu dispositivo",
				items: [
					"Token de autenticación (localStorage): mantiene tu sesión iniciada.",
					"Preferencia de idioma (localStorage): recuerda el idioma que elegiste.",
					"Cookie de sesión de inicio con Google: la establece Google durante el inicio de sesión con Google.",
				],
				paragraphs: [
					"La aplicación guarda tres elementos en tu navegador, todos estrictamente necesarios para el funcionamiento del servicio, por eso no mostramos un banner de consentimiento de cookies:",
				],
			},
			{
				closing: [
					"Los textos, imágenes y audio de los juegos (creados por nosotros, no por los usuarios) son procesados por servicios de traducción y de síntesis de voz y se almacenan en un almacenamiento en la nube; no se envían datos personales de usuarios a estos servicios.",
					"Transferencias internacionales: los datos de tu cuenta residen en la UE. Cuando un proveedor procesa datos en EE. UU. (Google y nuestro proveedor de alojamiento de la aplicación web), la transferencia se basa en el Marco de Privacidad de Datos UE–EE. UU. (EU–US Data Privacy Framework), bajo el cual dichos proveedores están certificados.",
				],
				heading: "7. Proveedores de servicios",
				items: [
					"Google (Google LLC, EE. UU.): inicio de sesión con Google. Datos: correo, nombre, identificador de cuenta, URL de la foto de perfil.",
					"Nuestro proveedor de servidores y base de datos (UE): todos los datos de cuenta indicados arriba.",
					"Nuestro proveedor de alojamiento de la aplicación web (EE. UU.): direcciones IP de los visitantes en los registros de acceso.",
				],
				paragraphs: ["Tus datos son procesados por los siguientes proveedores:"],
			},
			{
				heading: "8. Cuánto tiempo conservamos los datos",
				paragraphs: [
					"Conservamos tus datos hasta que elimines tu cuenta. Al eliminarla, tu perfil, el progreso en los juegos y los tokens de acceso se borran de forma permanente. Única excepción: los registros de consentimiento se conservan de forma anonimizada (sin nombre, correo ni dirección IP) como prueba de que el consentimiento existió, lo cual la ley permite para la defensa de reclamaciones legales. Los registros del servidor se conservan durante un período limitado y luego se rotan.",
				],
			},
			{
				heading: "9. Tus derechos",
				items: [
					"Ver y corregir tus datos: tu perfil es visible y editable en la aplicación.",
					"Eliminar tu cuenta y tus datos: directamente en los ajustes de la aplicación; la eliminación es permanente.",
					"Obtener una copia de tus datos: escríbenos a privacy@smartsprouts.pp.ua y te enviaremos una exportación en formato legible por máquina en un plazo de 30 días.",
					"Presentar una reclamación: ante la autoridad de protección de datos de tu lugar de residencia.",
				],
				paragraphs: ["Puedes:"],
			},
			{
				heading: "10. Cambios en esta política",
				paragraphs: [
					"Cuando cambiemos esta política, actualizaremos la versión y la fecha de entrada en vigor indicadas arriba, y la aplicación pedirá a los titulares de las cuentas revisar y volver a aceptar los documentos vigentes.",
				],
			},
			{
				heading: "11. Contacto",
				paragraphs: ["privacy@smartsprouts.pp.ua"],
			},
		],
		title: "Política de Privacidad de SmartSprouts",
	},
	terms: {
		meta: "Versión: {{version}} · Fecha de entrada en vigor: {{effectiveDate}}",
		sections: [
			{
				heading: "1. Quiénes somos",
				paragraphs: [
					"SmartSprouts («nosotros», el «Servicio») es un servicio de juegos educativos para niños, operado como proyecto independiente. Contacto: privacy@smartsprouts.pp.ua.",
				],
			},
			{
				heading: "2. Cuentas: solo adultos, en nombre de un niño",
				items: [
					"Una cuenta solo puede crearla y mantenerla un adulto (18 años o más) que sea padre, madre o tutor legal del niño que usará el Servicio.",
					"Al crear una cuenta confirmas que tienes 18 años o más, que eres el padre, la madre o el tutor legal del niño y que autorizas el procesamiento del progreso de aprendizaje del niño según se describe en la Política de Privacidad.",
					"Eres responsable de mantener seguras tus credenciales de acceso y de toda la actividad de tu cuenta, incluido el uso del Servicio por parte del niño.",
				],
			},
			{
				heading: "3. Aceptación de estos Términos",
				paragraphs: [
					"Aceptas estos Términos al marcar la casilla de confirmación en el registro (o, para cuentas existentes, cuando la aplicación te pida revisar una versión actualizada). Si no estás de acuerdo, no uses el Servicio.",
				],
			},
			{
				heading: "4. El Servicio",
				paragraphs: [
					"SmartSprouts ofrece juegos educativos para niños. Actualmente el Servicio se presta de forma gratuita. Podemos añadir, cambiar o retirar funciones en cualquier momento; si algún día introducimos funciones de pago, estarán claramente señaladas y se ofrecerán por separado.",
				],
			},
			{
				heading: "5. Uso aceptable",
				items: [
					"usar el Servicio con fines ilícitos;",
					"intentar obtener acceso no autorizado al Servicio, a otras cuentas o a nuestra infraestructura;",
					"interrumpir o sobrecargar el Servicio (incluida la extracción automatizada de datos o las solicitudes masivas);",
					"copiar, revender o redistribuir el Servicio o su contenido fuera del uso personal normal.",
				],
				paragraphs: ["Te comprometes a no:"],
			},
			{
				heading: "6. Propiedad intelectual",
				paragraphs: [
					"Todo el contenido del Servicio (juegos, textos, imágenes, audio y software) nos pertenece a nosotros o a nuestros licenciantes. Recibes una licencia personal, intransferible y no comercial para usar el Servicio con tu cuenta. Esta licencia termina cuando tu cuenta se elimina o se cierra.",
				],
			},
			{
				heading: "7. Sin garantías educativas",
				paragraphs: [
					"SmartSprouts es una herramienta de aprendizaje complementaria. No sustituye la educación profesional, las clases particulares ni ninguna forma de evaluación o diagnóstico educativo o del desarrollo. No prometemos resultados de aprendizaje ni logros académicos.",
				],
			},
			{
				heading: "8. El Servicio se ofrece «tal cual»",
				paragraphs: [
					"En la máxima medida permitida por la ley, el Servicio se ofrece «tal cual» y «según disponibilidad», sin garantías de ningún tipo, expresas o implícitas, incluidas la idoneidad para un fin determinado, la disponibilidad o el funcionamiento sin errores.",
				],
			},
			{
				heading: "9. Limitación de responsabilidad",
				paragraphs: [
					"En la máxima medida permitida por la ley, no somos responsables de daños indirectos, incidentales o consecuentes, ni de la pérdida de datos causada por circunstancias fuera de nuestro control razonable; y nuestra responsabilidad total por cualquier reclamación relacionada con el Servicio se limita al importe que nos hayas pagado por él en los doce meses anteriores a la reclamación (actualmente cero, ya que el Servicio es gratuito).",
					"Esta sección no limita los derechos que la legislación de protección del consumidor u otra legislación te otorgue con carácter imperativo, incluidas, para los usuarios de la UE, las protecciones imperativas del consumidor de tu país de residencia.",
				],
			},
			{
				heading: "10. Terminación",
				items: [
					"Puedes dejar de usar el Servicio y eliminar tu cuenta en cualquier momento desde los ajustes de la aplicación.",
					"Podemos suspender o cerrar una cuenta que infrinja estos Términos, con aviso previo cuando sea razonablemente posible.",
					"Tras la eliminación o el cierre, tus datos se tratan según se describe en la Política de Privacidad.",
				],
			},
			{
				heading: "11. Cambios en estos Términos",
				paragraphs: [
					"Cuando cambiemos estos Términos, actualizaremos la versión y la fecha de entrada en vigor indicadas arriba, y la aplicación te pedirá revisar y aceptar la versión vigente antes de continuar usándolo.",
				],
			},
			{
				heading: "12. Ley aplicable y disputas",
				paragraphs: [
					"Estos Términos se rigen por la ley de Ucrania, y las disputas se someten a los tribunales de Ucrania. Esto no te priva, sin embargo, si eres consumidor, de la protección de las normas imperativas del derecho del consumidor de tu país de residencia ni de tu derecho a iniciar procedimientos allí.",
				],
			},
			{
				heading: "13. Idioma",
				paragraphs: [
					"Estos Términos están redactados en inglés, ucraniano y español. La versión en inglés prevalece legalmente; las traducciones se ofrecen por conveniencia.",
				],
			},
			{
				heading: "14. Contacto",
				paragraphs: ["privacy@smartsprouts.pp.ua"],
			},
		],
		title: "Términos de Servicio de SmartSprouts",
	},
};

export { legal };
