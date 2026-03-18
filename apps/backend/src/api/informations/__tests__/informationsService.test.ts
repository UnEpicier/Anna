import { InformationsRepository } from '@/api/informations/informationsRepository';
import { InformationsService } from '@/api/informations/informationsService';
import type { Informations } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';

vi.mock('@/api/informations/informationsRepository');

describe('informationsService', () => {
	let informationsServiceInstance: InformationsService;
	let informationsRepositoryInstance: InformationsRepository;

	const mockInformations: Informations = {
		id: 1,
		email: 'alice@example.com',
		phone: '0607080901',
		address: '123 Main St, Springfield',
		actionAddress: '456 Elm St, Springfield',
		actionLong: -93.2923,
		actionLat: 44.9537,
		actionRadius: 100,
		facebook: '',
		instagram: '',
		notifyLeave: 30,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	};

	beforeEach(() => {
		informationsRepositoryInstance = new InformationsRepository();
		informationsServiceInstance = new InformationsService(
			informationsRepositoryInstance
		);
	});

	describe('findAll', () => {
		it('return informations', async () => {
			// Arrange
			(informationsRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockInformations
			);

			// Act
			const result = await informationsServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Informations found');
			expect(result.responseObject).toEqual(mockInformations);
		});

		it('returns a not found error for no informations found', async () => {
			// Arrange
			(informationsRepositoryInstance.findAsync as Mock).mockReturnValue(
				null
			);

			// Act
			const result = await informationsServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals('No Informations found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for findAsync', async () => {
			// Arrange
			(
				informationsRepositoryInstance.findAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await informationsServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving informations.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns the informations', async () => {
			// Arrange
			const updateData: Partial<Informations> = { phone: '0987654321' };
			const updatedInformations: Informations = {
				...mockInformations,
				...updateData,
			};
			(
				informationsRepositoryInstance.updateAsync as Mock
			).mockReturnValue(updatedInformations);

			// Act
			const result = await informationsServiceInstance.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Informations updated successfully');
			expect(result.responseObject).toEqual(updatedInformations);
		});

		it('handles errors for updateAsync', async () => {
			// Arrange
			const updateData: Partial<Informations> = { phone: '0987654321' };
			(
				informationsRepositoryInstance.updateAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await informationsServiceInstance.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating informations.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
