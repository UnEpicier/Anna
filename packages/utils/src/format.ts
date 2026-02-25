export function formatPhoneNumber(phone: string): string {
	// Remove all non-digit characters
	const digits = phone.replace(/\D/g, '');
	
	// Format the number as XX.XX.XX.XX.XX
	if (digits.length === 10) {
		return digits.replace(
			/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
			'$1.$2.$3.$4.$5',
		);
	} else if (phone.startsWith('+')) {
		// Handle international format
		const intlDigits = phone.replace(/\D/g, '');
		const countryCodeMatch = phone.match(/^\+(\d{1,3})/);
		if (countryCodeMatch) {
			const countryCode = countryCodeMatch[1];
			if (!countryCode) {
				return phone; // Return original if no valid country code
			}
			
			const numberPart = intlDigits.slice(countryCode.length);
			if (numberPart.length === 10) {
				return (
					`+${countryCode} ` +
					numberPart.replace(
						/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
						'$1.$2.$3.$4.$5',
					)
				);
			} else {
				return phone; // Return original if not 10 digits after country code
			}
		} else {
			return phone; // Return original if no valid country code
		}
	} else {
		return phone;
	}
}

export function capitalize(text: string): string {
	if (text.length === 0) return text;
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatTime(date: Date | string): string {
	const dateObj = new Date(date);
	
	const hours = dateObj.getHours().toString().padStart(2, '0');
	const minutes = dateObj.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
}
