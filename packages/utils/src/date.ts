export function getLocale(acceptLanguage: string): string {
	const locales = acceptLanguage
		.split(',')
		.map((part) => {
			const [locale, q] = part.trim().split(';q=');
			return {
				locale: (locale as string).trim(),
				q: q ? parseFloat(q) : 1.0,
			};
		})
		.sort((a, b) => b.q - a.q)
		.map((entry) => entry.locale);

	// Try each locale until one is valid for Intl
	for (const locale of locales) {
		try {
			Intl.DateTimeFormat.supportedLocalesOf([locale]);
			return locale;
		} catch {
			continue;
		}
	}

	return 'fr-FR';
}
