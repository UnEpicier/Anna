import { commonValidations } from '@/commons/utils/commonValidation';

describe('commonValidations', () => {
	describe('id', () => {
		it('accepts a valid numeric string and transforms it to a number', () => {
			const result = commonValidations.id.safeParse('42');

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe(42);
			}
		});

		it('accepts "1" as a valid id', () => {
			const result = commonValidations.id.safeParse('1');

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toBe(1);
			}
		});

		it('rejects non-numeric strings', () => {
			const result = commonValidations.id.safeParse('abc');

			expect(result.success).toBe(false);
		});

		it('rejects alphanumeric strings', () => {
			const result = commonValidations.id.safeParse('12abc');

			expect(result.success).toBe(false);
		});

		it('rejects zero', () => {
			const result = commonValidations.id.safeParse('0');

			expect(result.success).toBe(false);
		});

		it('rejects negative numbers', () => {
			const result = commonValidations.id.safeParse('-1');

			expect(result.success).toBe(false);
		});

		it('rejects empty string', () => {
			const result = commonValidations.id.safeParse('');

			expect(result.success).toBe(false);
		});
	});
});
