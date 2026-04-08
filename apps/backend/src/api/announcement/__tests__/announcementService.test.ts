import { AnnouncementRepository } from '@/api/announcement/announcementRepository';
import { AnnouncementService } from '@/api/announcement/announcementService';
import type { Announcement } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';

vi.mock('@/api/announcement/announcementRepository');
vi.mock('@/libs/redis', () => ({
	default: {
		get: vi.fn().mockResolvedValue(null),
		set: vi.fn().mockResolvedValue('OK'),
		del: vi.fn().mockResolvedValue(1),
	},
}));

describe('announcementService', () => {
	let service: AnnouncementService;
	let repository: AnnouncementRepository;

	const mockAnnouncement: Announcement = {
		id: 1,
		enabled: true,
		title: 'Annonce',
		message: 'Bonjour !',
		ctaLabel: null,
		ctaUrl: null,
		ctaOpenInNewTab: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	beforeEach(() => {
		repository = new AnnouncementRepository();
		service = new AnnouncementService(repository);
	});

	describe('find', () => {
		it('returns announcement', async () => {
			// Arrange
			(repository.findAsync as Mock).mockReturnValue(mockAnnouncement);

			// Act
			const result = await service.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Announcement found');
			expect(result.responseObject).toEqual(mockAnnouncement);
		});

		it('handles errors for findAsync', async () => {
			// Arrange
			(repository.findAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await service.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving announcement.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns announcement', async () => {
			// Arrange
			const updateData: Partial<Announcement> = { message: 'Updated!' };
			const updated: Announcement = { ...mockAnnouncement, ...updateData };
			(repository.updateAsync as Mock).mockReturnValue(updated);

			// Act
			const result = await service.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Announcement updated successfully');
			expect(result.responseObject).toEqual(updated);
		});

		it('handles errors for updateAsync', async () => {
			// Arrange
			(repository.updateAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await service.update({ message: 'fail' });

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating announcement.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
