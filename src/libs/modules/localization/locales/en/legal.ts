const legal = {
	draftBanner: "DRAFT",
	languageNote:
		"This document is written in English, Ukrainian, and Spanish. The English version prevails legally; translations are provided for convenience.",
	links: {
		navLabel: "Legal documents",
		privacy: "Privacy Policy",
		terms: "Terms of Service",
	},
	privacy: {
		meta: "Version: {{version}} · Effective date: {{effectiveDate}}",
		sections: [
			{
				heading: "1. Who we are",
				paragraphs: [
					"SmartSprouts (\"we\", \"us\") is an educational game service for children, operated as an independent project. For any question or request about your personal data, contact us at privacy@smartsprouts.pp.ua. We answer data requests within 30 days.",
				],
			},
			{
				heading: "2. How SmartSprouts accounts work",
				paragraphs: [
					"A SmartSprouts account is created and held by an adult (18+, a parent or legal guardian) on behalf of a child. We do not ask for, and do not want, the child's name, email, photo, or any other direct identifier. Learning progress recorded while a child plays is stored under the adult's account and is processed with the parent's or guardian's authorization, given at registration.",
				],
			},
			{
				closing: [
					"We do not collect ads identifiers, location data, or behavioral tracking data, and we do not sell or share personal data for advertising.",
				],
				heading: "3. Data we collect",
				items: [
					"Email address and display name: from you at registration, or from your Google profile if you sign in with Google.",
					"Password (stored only as a cryptographic hash): from you at registration.",
					"Google account ID and profile picture URL: from Google, if you sign in with Google.",
					"Game progress (levels played, scores, timestamps): created while the game is used.",
					"Consent records (document version, date, IP address, browser identifier): created when you accept our Terms.",
					"Server logs (IP address, technical request data): created automatically when the app talks to our servers.",
				],
			},
			{
				heading: "4. Why we process it (purposes and legal bases)",
				items: [
					"To provide the service: operating your account, saving game progress, signing you in. Legal basis: performance of our contract with you (GDPR Art. 6(1)(b)).",
					"To keep the service secure: server logs and technical diagnostics. Legal basis: our legitimate interest in running a secure service (GDPR Art. 6(1)(f)).",
					"To prove consent was given: the consent record created when you accept the Terms. Legal basis: our legal obligations and legitimate interest in establishing and defending legal claims.",
				],
			},
			{
				heading: "5. Children",
				paragraphs: [
					"SmartSprouts is designed for children to use under an adult's account and authorization. We do not knowingly collect personal information directly from children. Identifiers that reach our servers while a child plays (such as the session token or IP address) are used solely to operate the service, never for advertising, tracking, or profiling. The learning progress associated with the account is processed on the basis of the parent's or guardian's authorization given at registration.",
				],
			},
			{
				heading: "6. Storage on your device",
				items: [
					"Authentication token (localStorage): keeps you signed in.",
					"Language preference (localStorage): remembers your chosen language.",
					"Google sign-in session cookie: set by Google during Google sign-in.",
				],
				paragraphs: [
					"The app stores three things in your browser, all strictly necessary for the service to work, which is why we do not show a cookie consent banner:",
				],
			},
			{
				closing: [
					"Game texts, images, and audio (created by us, not by users) are processed by translation and speech services and stored in cloud storage; no user personal data is sent to these services.",
					"International transfers: your account data lives in the EU. Where a provider processes data in the US (Google and our web app hosting provider), the transfer relies on the EU–US Data Privacy Framework, under which these providers are certified.",
				],
				heading: "7. Service providers",
				items: [
					"Google (Google LLC, US): sign-in with Google. Data involved: email, name, account ID, profile picture URL.",
					"Our server and database hosting provider (EU): all account data listed above.",
					"Our web app hosting provider (US): visitor IP addresses in access logs.",
				],
				paragraphs: ["Your data is processed by the following providers:"],
			},
			{
				heading: "8. How long we keep data",
				paragraphs: [
					"We keep your data until you delete your account. When you delete it, your profile, game progress, and access tokens are permanently removed. One exception: consent records are kept in anonymized form (with no name, email, or IP address) as proof that consent existed, which the law permits for the defense of legal claims. Server logs are kept for a limited period and then rotated.",
				],
			},
			{
				heading: "9. Your rights",
				items: [
					"See and correct your data: your profile is visible and editable in the app.",
					"Delete your account and data: available directly in the app settings; deletion is permanent.",
					"Get a copy of your data: email us at privacy@smartsprouts.pp.ua and we will send a machine-readable export within 30 days.",
					"Complain: you may lodge a complaint with the data protection authority of your place of residence.",
				],
				paragraphs: ["You can:"],
			},
			{
				heading: "10. Changes to this policy",
				paragraphs: [
					"When we change this policy, we update the version and effective date above, and the app will ask account holders to review and re-accept the current documents.",
				],
			},
			{
				heading: "11. Contact",
				paragraphs: ["privacy@smartsprouts.pp.ua"],
			},
		],
		title: "SmartSprouts Privacy Policy",
	},
	terms: {
		meta: "Version: {{version}} · Effective date: {{effectiveDate}}",
		sections: [
			{
				heading: "1. Who we are",
				paragraphs: [
					"SmartSprouts (\"we\", \"us\", the \"Service\") is an educational game service for children, operated as an independent project. Contact: privacy@smartsprouts.pp.ua.",
				],
			},
			{
				heading: "2. Accounts: adults only, on behalf of a child",
				items: [
					"An account may be created and held only by an adult (18 years or older) who is a parent or legal guardian of the child who will use the Service.",
					"By creating an account you confirm that you are 18 or older, that you are the child's parent or legal guardian, and that you authorize the processing of the child's learning progress as described in the Privacy Policy.",
					"You are responsible for keeping your sign-in credentials safe and for all activity under your account, including the child's use of the Service.",
				],
			},
			{
				heading: "3. Acceptance of these Terms",
				paragraphs: [
					"You accept these Terms by ticking the confirmation box at registration (or, for existing accounts, when the app asks you to review an updated version). If you do not agree, do not use the Service.",
				],
			},
			{
				heading: "4. The Service",
				paragraphs: [
					"SmartSprouts provides educational games for children. The Service is currently provided free of charge. We may add, change, or remove features at any time; if we ever introduce paid features, they will be clearly marked and offered separately.",
				],
			},
			{
				heading: "5. Acceptable use",
				items: [
					"use the Service for any unlawful purpose;",
					"attempt to gain unauthorized access to the Service, other accounts, or our infrastructure;",
					"disrupt or overload the Service (including automated scraping or bulk requests);",
					"copy, resell, or redistribute the Service or its content outside normal personal use.",
				],
				paragraphs: ["You agree not to:"],
			},
			{
				heading: "6. Intellectual property",
				paragraphs: [
					"All content of the Service (games, texts, images, audio, and software) belongs to us or our licensors. You receive a personal, non-transferable, non-commercial license to use the Service with your account. This license ends when your account is deleted or terminated.",
				],
			},
			{
				heading: "7. No educational guarantees",
				paragraphs: [
					"SmartSprouts is a supplementary learning tool. It is not a substitute for professional education, tutoring, or any form of educational or developmental assessment or diagnostics. We make no promises about learning outcomes or academic results.",
				],
			},
			{
				heading: "8. The Service is provided \"as is\"",
				paragraphs: [
					"To the maximum extent permitted by law, the Service is provided \"as is\" and \"as available\", without warranties of any kind, express or implied, including fitness for a particular purpose, availability, or error-free operation.",
				],
			},
			{
				heading: "9. Limitation of liability",
				paragraphs: [
					"To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages, or for loss of data caused by circumstances outside our reasonable control; and our total liability for any claims relating to the Service is limited to the amount you paid us for it in the twelve months before the claim (currently zero, as the Service is free).",
					"This section does not limit any rights that consumer protection or other law grants you mandatorily, including, for users in the EU, the mandatory consumer protections of your country of residence.",
				],
			},
			{
				heading: "10. Termination",
				items: [
					"You may stop using the Service and delete your account at any time in the app settings.",
					"We may suspend or terminate an account that violates these Terms, after notice where reasonably possible.",
					"Upon deletion or termination, your data is handled as described in the Privacy Policy.",
				],
			},
			{
				heading: "11. Changes to these Terms",
				paragraphs: [
					"When we change these Terms, we update the version and effective date above, and the app will ask you to review and accept the current version before continued use.",
				],
			},
			{
				heading: "12. Governing law and disputes",
				paragraphs: [
					"These Terms are governed by the law of Ukraine, and disputes are subject to the courts of Ukraine. This does not, however, deprive you, if you are a consumer, of the protection of mandatory consumer law of your country of residence or of your right to bring proceedings there.",
				],
			},
			{
				heading: "13. Language",
				paragraphs: [
					"These Terms are written in English, Ukrainian, and Spanish. The English version prevails legally; translations are provided for convenience.",
				],
			},
			{
				heading: "14. Contact",
				paragraphs: ["privacy@smartsprouts.pp.ua"],
			},
		],
		title: "SmartSprouts Terms of Service",
	},
};

export { legal };
