import type { Service } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import {
	service as mockService,
	ServicesRepository,
} from '@/api/services/servicesRepository';
import { ServicesService } from '@/api/services/servicesService';

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
			expect(result.message).equals('Any services found');
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

	describe('find', () => {
		it('returns the service', async () => {
			// Arrange
			(servicesRepositoryInstance.findById as Mock).mockReturnValue(
				mockService
			);

			// Act
			const result = await servicesServiceInstance.find(
				`${mockService.id}`
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Service found');
			expect(result.responseObject).toEqual(mockService);
		});

		it('returns a not found error for non-existing service', async () => {
			// Arrange
			(servicesRepositoryInstance.findById as Mock).mockReturnValue(null);

			// Act
			const result = await servicesServiceInstance.find('999');

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Service not found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for find', async () => {
			// Arrange
			(servicesRepositoryInstance.findById as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.find('1');

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while retrieving service.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('create', () => {
		it('creates and returns the service', async () => {
			// Arrange
			const serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> =
				{
					title: 'New Service',
					icon: 'new-icon',
					price: 50,
					duration: '30min',
					description: 'A description for the new service',
					enabled: true,
				};
			const createdService: Service = {
				id: 2,
				...serviceData,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
			(servicesRepositoryInstance.create as Mock).mockReturnValue(
				createdService
			);

			// Act
			const result = await servicesServiceInstance.create(serviceData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.CREATED);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Service created successfully');
			expect(result.responseObject).toEqual(createdService);
		});

		it('handles errors for create', async () => {
			// Arrange
			const serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'> =
				{
					title: 'New Service',
					icon: 'new-icon',
					price: 50,
					duration: '30min',
					description: 'A description for the new service',
					enabled: true,
				};
			(servicesRepositoryInstance.create as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.create(serviceData);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while creating service.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns the service', async () => {
			// Arrange
			const updateData: Partial<Service> = { enabled: false };
			const updatedService: Service = { ...mockService, ...updateData };
			(servicesRepositoryInstance.update as Mock).mockReturnValue(
				updatedService
			);

			// Act
			const result = await servicesServiceInstance.update(
				`${mockService.id}`,
				updateData
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Service updated successfully');
			expect(result.responseObject).toEqual(updatedService);
		});

		it('handles errors for update', async () => {
			// Arrange
			const updateData: Partial<Service> = { enabled: false };
			(servicesRepositoryInstance.update as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await servicesServiceInstance.update(
				'1',
				updateData
			);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating service.'
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
	});
});
