import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import {
	LeaveRepository,
	leave as mockLeave,
} from '@/api/leave/leaveRepository';
import { LeaveService } from '@/api/leave/leaveService';

vi.mock('@/api/leave/leaveRepository');

describe('leaveService', () => {
	let leaveServiceInstance: LeaveService;
	let leaveRepositoryInstance: LeaveRepository;

	beforeEach(() => {
		leaveRepositoryInstance = new LeaveRepository();
		leaveServiceInstance = new LeaveService(leaveRepositoryInstance);
	});

	describe('find', () => {
		it('return leave', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);

			// Act
			const result = await leaveServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Leave found');
			expect(result.responseObject).toEqual(mockLeave);
		});

		it('return null when no leave found', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(null);

			// Act
			const result = await leaveServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NO_CONTENT);
			expect(result.success).toBeFalsy();
			expect(result.message).equals('No leave found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for findAsync', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.find();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving leave.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('create', () => {
		it('creates and returns the leave', async () => {
			// Arrange
			const createData: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
				from: new Date('2024-01-01'),
				to: new Date('2024-01-10'),
			};
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(null);
			(leaveRepositoryInstance.createAsync as Mock).mockReturnValue({
				id: 1,
				...createData,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			// Act
			const result = await leaveServiceInstance.create(createData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.CREATED);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Leave created successfully');
			expect(result.responseObject).toEqual({
				id: 1,
				...createData,
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			});
		});

		it('returns error when leave already exists', async () => {
			// Arrange
			const createData: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
				from: new Date('2024-01-01'),
				to: new Date('2024-01-10'),
			};
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);

			// Act
			const result = await leaveServiceInstance.create(createData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.CONFLICT);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Leave already exists');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for createAsync', async () => {
			// Arrange
			const createData: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
				from: new Date('2024-01-01'),
				to: new Date('2024-01-10'),
			};
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(null);
			(leaveRepositoryInstance.createAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.create(createData);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while creating leave.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('update', () => {
		it('updates and returns the leave', async () => {
			// Arrange
			const updateData: Partial<Leave> = { to: new Date('2024-12-31') };
			const updatedInformations: Leave = { ...mockLeave, ...updateData };
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);
			(leaveRepositoryInstance.updateAsync as Mock).mockReturnValue(
				updatedInformations
			);

			// Act
			const result = await leaveServiceInstance.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Leave updated successfully');
			expect(result.responseObject).toEqual(updatedInformations);
		});

		it('return error when no leave found', async () => {
			// Arrange
			const updateData: Partial<Leave> = { to: new Date('2024-12-31') };
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(null);
			(leaveRepositoryInstance.updateAsync as Mock).mockReturnValue(null);

			// Act
			const result = await leaveServiceInstance.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Leave not found');
			expect(result.responseObject).toBeNull;
		});

		it('handles errors for updateAsync', async () => {
			// Arrange
			const updateData: Partial<Leave> = { to: new Date('2024-12-31') };
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);
			(leaveRepositoryInstance.updateAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.update(updateData);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating leave.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('delete', () => {
		it('deletes and returns the leave', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);
			(leaveRepositoryInstance.deleteAsync as Mock).mockReturnValue(null);

			// Act
			const result = await leaveServiceInstance.delete();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Leave deleted successfully');
			expect(result.responseObject).toBeNull();
		});

		it('return error when no leave found', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(null);
			(leaveRepositoryInstance.deleteAsync as Mock).mockReturnValue(null);

			// Act
			const result = await leaveServiceInstance.delete();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Leave not found');
			expect(result.responseObject).toBeNull;
		});

		it('handles errors for deleteAsync', async () => {
			// Arrange
			(leaveRepositoryInstance.findAsync as Mock).mockReturnValue(
				mockLeave
			);
			(leaveRepositoryInstance.deleteAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.delete();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while deleting leave.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
