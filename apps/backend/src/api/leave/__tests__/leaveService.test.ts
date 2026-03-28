import { LeaveRepository } from '@/api/leave/leaveRepository';
import { LeaveService } from '@/api/leave/leaveService';
import { Prisma } from '@/generated/prisma-client/client';
import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import { leave as mockLeave } from '../../../../prisma/data/leave';

const notFoundError = new Prisma.PrismaClientKnownRequestError('Record not found', {
	code: 'P2025',
	clientVersion: '0.0.0',
});

vi.mock('@/api/leave/leaveRepository');

describe('leaveService', () => {
	let leaveServiceInstance: LeaveService;
	let leaveRepositoryInstance: LeaveRepository;

	beforeEach(() => {
		leaveRepositoryInstance = new LeaveRepository();
		leaveServiceInstance = new LeaveService(leaveRepositoryInstance);
	});

	describe('findForFrontend', () => {
		it('return leave', async () => {
			// Arrange
			(
				leaveRepositoryInstance.findForFrontendAsync as Mock
			).mockReturnValue(mockLeave);

			// Act
			const result = await leaveServiceInstance.findForFrontend();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Leave found');
			expect(result.responseObject).toEqual(mockLeave);
		});

		it('return null when no leave found within 1 month', async () => {
			// Arrange
			(
				leaveRepositoryInstance.findForFrontendAsync as Mock
			).mockReturnValue(null);

			// Act
			const result = await leaveServiceInstance.findForFrontend();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NO_CONTENT);
			expect(result.success).toBeFalsy();
			expect(result.message).equals('No leave found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for findForFrontendAsync', async () => {
			// Arrange
			(
				leaveRepositoryInstance.findForFrontendAsync as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result = await leaveServiceInstance.findForFrontend();

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

	describe('findAll', () => {
		it('returns all leaves', async () => {
			// Arrange
			(leaveRepositoryInstance.findAllAsync as Mock).mockReturnValue([
				mockLeave,
			]);

			// Act
			const result = await leaveServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Leaves found');
			expect(result.responseObject).toEqual([mockLeave]);
		});

		it('handles errors for findAllAsync', async () => {
			// Arrange
			(leaveRepositoryInstance.findAllAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving leaves.'
			);
		});
	});

	describe('create', () => {
		it('creates and returns the leave', async () => {
			// Arrange
			const createData: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
				from: new Date('2024-01-01'),
				to: new Date('2024-01-10'),
			};
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

		it('handles errors for createAsync', async () => {
			// Arrange
			const createData: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'> = {
				from: new Date('2024-01-01'),
				to: new Date('2024-01-10'),
			};
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
			const updatedLeave: Leave = { ...mockLeave, ...updateData };
			(leaveRepositoryInstance.updateAsync as Mock).mockReturnValue(
				updatedLeave
			);

			// Act
			const result = await leaveServiceInstance.update(1, updateData);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Leave updated successfully');
			expect(result.responseObject).toEqual(updatedLeave);
		});

		it('returns not found when leave does not exist', async () => {
			// Arrange
			(leaveRepositoryInstance.updateAsync as Mock).mockRejectedValue(notFoundError);

			// Act
			const result = await leaveServiceInstance.update(99, {});

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Leave not found');
		});

		it('handles errors for updateAsync', async () => {
			// Arrange
			(leaveRepositoryInstance.updateAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.update(1, {});

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
		it('deletes the leave', async () => {
			// Arrange
			(leaveRepositoryInstance.deleteAsync as Mock).mockReturnValue(
				mockLeave
			);

			// Act
			const result = await leaveServiceInstance.delete(1);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Leave deleted successfully');
			expect(result.responseObject).toBeNull();
		});

		it('returns not found when leave does not exist', async () => {
			// Arrange
			(leaveRepositoryInstance.deleteAsync as Mock).mockRejectedValue(notFoundError);

			// Act
			const result = await leaveServiceInstance.delete(99);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Leave not found');
		});

		it('handles errors for deleteAsync', async () => {
			// Arrange
			(leaveRepositoryInstance.deleteAsync as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await leaveServiceInstance.delete(1);

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
