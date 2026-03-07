import type { Department } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import {
	DepartmentsRepository,
	department as mockDepartment,
} from '@/api/departments/departmentsRepository';
import { DepartmentsService } from '@/api/departments/departmentsService';

vi.mock('@/api/departments/departmentsRepository');

describe('departmentsService', () => {
	let departmentsServiceInstance: DepartmentsService;
	let departmentsRepositoryInstance: DepartmentsRepository;

	beforeEach(() => {
		departmentsRepositoryInstance = new DepartmentsRepository();
		departmentsServiceInstance = new DepartmentsService(
			departmentsRepositoryInstance
		);
	});

	describe('findAll', () => {
		it('return departments', async () => {
			// Arrange
			(
				departmentsRepositoryInstance.findAllAsync as Mock
			).mockReturnValue([mockDepartment]);

			// Act
			const result = await departmentsServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Departments found');
			expect(result.responseObject).toEqual([mockDepartment]);
		});

		it('handles errors for findAllAsync', async () => {
			// Arrange
			(
				departmentsRepositoryInstance.findAllAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await departmentsServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving departments.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('findActivesAsync', () => {
		it('return departments', async () => {
			// Arrange
			(
				departmentsRepositoryInstance.findActivesAsync as Mock
			).mockReturnValue([{ ...mockDepartment, active: true }]);

			// Act
			const result = await departmentsServiceInstance.findActives();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Active departments found');
			expect(result.responseObject).toEqual([
				{ ...mockDepartment, active: true },
			]);
		});

		it('handles errors for findActivesAsync', async () => {
			// Arrange
			(
				departmentsRepositoryInstance.findActivesAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await departmentsServiceInstance.findActives();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving active departments.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns the department', async () => {
			// Arrange
			const updateData: Partial<Department> = { active: true };
			const updatedInformations: Department = {
				...mockDepartment,
				...updateData,
			};
			(departmentsRepositoryInstance.updateAsync as Mock).mockReturnValue(
				updatedInformations
			);

			// Act
			const result = await departmentsServiceInstance.update(
				mockDepartment.code,
				updateData
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Department updated successfully');
			expect(result.responseObject).toEqual(updatedInformations);
		});

		it('handle invalid id', async () => {
			// Arrange
			const updateData: Partial<Department> = { active: true };
			const updatedInformations: Department = {
				...mockDepartment,
				...updateData,
			};
			(departmentsRepositoryInstance.updateAsync as Mock).mockReturnValue(
				updatedInformations
			);

			// Act
			const result = await departmentsServiceInstance.update(
				'invalid id',
				updateData
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Invalid ID provided');
			expect(result.responseObject).toBeNull();
		});

		it('handle invalid body', async () => {
			// Arrange
			const updateData: Partial<Department> = { active: true };
			const updatedInformations: Department = {
				...mockDepartment,
				...updateData,
			};
			(departmentsRepositoryInstance.updateAsync as Mock).mockReturnValue(
				updatedInformations
			);

			// Act
			const result = await departmentsServiceInstance.update(
				mockDepartment.code,
				{}
			);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Invalid request body');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for updateAsync', async () => {
			// Arrange
			const updateData: Partial<Department> = { active: true };
			(
				departmentsRepositoryInstance.updateAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await departmentsServiceInstance.update(
				mockDepartment.code,
				updateData
			);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating the department.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
