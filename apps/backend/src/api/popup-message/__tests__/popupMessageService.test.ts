import { PopupMessageRepository } from '@/api/popup-message/popupMessageRepository';
import { PopupMessageService } from '@/api/popup-message/popupMessageService';
import type { PopupMessage } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';

vi.mock('@/api/popup-message/popupMessageRepository');
vi.mock('@/libs/redis', () => ({
	default: {
		get: vi.fn().mockResolvedValue(null),
		set: vi.fn().mockResolvedValue('OK'),
		del: vi.fn().mockResolvedValue(1),
	},
}));

describe('popupMessageService', () => {
	let service: PopupMessageService;
	let repository: PopupMessageRepository;

	const mockPopupMessage: PopupMessage = {
		id: 1,
		enabled: true,
		title: 'Annonce',
		message: 'Bonjour !',
		ctaLabel: null,
		ctaUrl: null,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(() => {
		repository = new PopupMessageRepository();
		service = new PopupMessageService(repository);
	});

	describe('find', () => {
		it('returns popup message', async () => {
			(repository.findAsync as Mock).mockReturnValue(mockPopupMessage);

			const result = await service.find();

			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('PopupMessage found');
			expect(result.responseObject).toEqual(mockPopupMessage);
		});

		it('handles errors for findAsync', async () => {
			(repository.findAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			const result = await service.find();

			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving popup message.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns popup message', async () => {
			const updateData: Partial<PopupMessage> = { message: 'Updated!' };
			const updated: PopupMessage = { ...mockPopupMessage, ...updateData };
			(repository.updateAsync as Mock).mockReturnValue(updated);

			const result = await service.update(updateData);

			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('PopupMessage updated successfully');
			expect(result.responseObject).toEqual(updated);
		});

		it('handles errors for updateAsync', async () => {
			(repository.updateAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			const result = await service.update({ message: 'fail' });

			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating popup message.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
