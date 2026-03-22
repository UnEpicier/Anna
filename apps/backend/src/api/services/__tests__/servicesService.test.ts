import { ServicesRepository } from '@/api/services/servicesRepository';
import { ServicesService } from '@/api/services/servicesService';
import type { Service } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import { services } from '../../../../prisma/data/services';

const mockService = services[0];

vi.mock('@/api/services/servicesRepository');

describe('servicesService', () => {
	let servicesServiceInstance: ServicesService;
	let servicesRepositoryInstance: ServicesRepository;

	beforeEach(() => {
		servicesRepositoryInstance = new ServicesRepository();
		servicesServiceInstance = new ServicesService(
			servicesRepositoryInstance
		);
	});

	describe('findAll', () => {
		it('return services', async () => {
			// Arrange
			(servicesRepositoryInstance.findAll as Mock).mockReturnValue([
				mockService,
			]);

			// Act
			const result = await servicesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Services found');
			expect(result.responseObject).toEqual([mockService]);
		});

		it('returns a not found error for no services found', async () => {
			// Arrange
			(servicesRepositoryInstance.findAll as Mock).mockReturnValue(null);

			// Act
			const result = await servicesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals('No services found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for findAll', async () => {
			// Arrange
			(servicesRepositoryInstance.findAll as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving services.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('createMany', () => {
		it('creates and returns services', async () => {
			// Arrange
			const serviceData: Omit<
				Service,
				'id' | 'enabled' | 'createdAt' | 'updatedAt'
			> = {
				title: 'New Service',
				icon: 'new-icon',
				price: 50,
				duration: '30min',
				description: 'A description for the new service',
			};
			const createdService: Service = {
				id: 2,
				...serviceData,
				enabled: true,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			(servicesRepositoryInstance.createMany as Mock).mockReturnValue([
				createdService,
			]);

			// Act
			const result = await servicesServiceInstance.createMany([
				serviceData,
			]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.CREATED);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Services created successfully');
			expect(result.responseObject).toEqual([createdService]);
		});

		it('returns 400 for missing required fields', async () => {
			// Arrange
			const invalidData = [
				{ icon: 'icon', price: 50 },
			] as unknown as Omit<
				Service,
				'id' | 'enabled' | 'createdAt' | 'updatedAt'
			>[];

			// Act
			const result =
				await servicesServiceInstance.createMany(invalidData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Missing required fields');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for createMany', async () => {
			// Arrange
			const serviceData: Omit<
				Service,
				'id' | 'enabled' | 'createdAt' | 'updatedAt'
			> = {
				title: 'New Service',
				icon: 'new-icon',
				price: 50,
				duration: '30min',
				description: 'A description for the new service',
			};
			(servicesRepositoryInstance.createMany as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.createMany([
				serviceData,
			]);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while creating services.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('updateMany', () => {
		it('updates and returns services', async () => {
			// Arrange
			const updateData: Partial<Service> = {
				id: mockService.id,
				enabled: false,
			};
			const updatedService: Service = { ...mockService, ...updateData };
			(servicesRepositoryInstance.updateMany as Mock).mockReturnValue([
				updatedService,
			]);

			// Act
			const result = await servicesServiceInstance.updateMany([
				updateData,
			]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Services updated successfully');
			expect(result.responseObject).toEqual([updatedService]);
		});

		it('returns 400 for missing service ID', async () => {
			// Act
			const result = await servicesServiceInstance.updateMany([
				{ title: 'No ID' },
			]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Missing service ID');
			expect(result.responseObject).toBeNull();
		});

		it('returns 400 for invalid service ID', async () => {
			// Act
			const result = await servicesServiceInstance.updateMany([
				{ id: 'invalid' as unknown as number },
			]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Invalid ID provided');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for updateMany', async () => {
			// Arrange
			(servicesRepositoryInstance.updateMany as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.updateMany([
				{ id: mockService.id },
			]);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating services.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('delete', () => {
		it('deletes the service', async () => {
			// Arrange
			(servicesRepositoryInstance.delete as Mock).mockReturnValue(
				undefined
			);

			// Act
			const result = await servicesServiceInstance.delete(
				`${mockService.id}`
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Service deleted successfully');
			expect(result.responseObject).toBeNull();
		});

		it('returns 400 for invalid id', async () => {
			// Act
			const result = await servicesServiceInstance.delete('invalid');

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Invalid ID provided');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for delete', async () => {
			// Arrange
			(servicesRepositoryInstance.delete as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.delete(
				`${mockService.id}`
			);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while deleting service.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
