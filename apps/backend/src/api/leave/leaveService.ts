import { LeaveRepository } from '@/api/leave/leaveRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import type { Leave } from '@repo/app-types';
import { Prisma } from '@/generated/prisma-client/client';
import { StatusCodes } from 'http-status-codes';

export class LeaveService {
	private leaveRepository: LeaveRepository;

	constructor(repository: LeaveRepository = new LeaveRepository()) {
		this.leaveRepository = repository;
	}

	async findForFrontend(): Promise<ServiceResponse<Leave | null>> {
		try {
			const leave = await this.leaveRepository.findForFrontendAsync();
			if (!leave) {
				return ServiceResponse.failure(
					'No leave found',
					null,
					StatusCodes.NO_CONTENT
				);
			}
			return ServiceResponse.success<Leave>('Leave found', leave);
		} catch (error) {
			const errorMessage = `Error finding leave: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async findAll(): Promise<ServiceResponse<Leave[] | null>> {
		try {
			const leaves = await this.leaveRepository.findAllAsync();
			return ServiceResponse.success<Leave[]>('Leaves found', leaves);
		} catch (error) {
			const errorMessage = `Error finding leaves: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving leaves.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async create(
		data: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ServiceResponse<Leave | null>> {
		try {
			const newLeave = await this.leaveRepository.createAsync(data);
			return ServiceResponse.success<Leave>(
				'Leave created successfully',
				newLeave,
				StatusCodes.CREATED
			);
		} catch (error) {
			const errorMessage = `Error creating leave: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while creating leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		id: number,
		data: Partial<Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>>
	): Promise<ServiceResponse<Leave | null>> {
		try {
			const updatedLeave = await this.leaveRepository.updateAsync(
				id,
				data
			);
			return ServiceResponse.success<Leave>(
				'Leave updated successfully',
				updatedLeave
			);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				return ServiceResponse.failure('Leave not found', null, StatusCodes.NOT_FOUND);
			}
			console.error(`Error updating leave: ${(error as Error).message}`);
			return ServiceResponse.failure(
				'An error occurred while updating leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async delete(id: number): Promise<ServiceResponse<Leave | null>> {
		try {
			await this.leaveRepository.deleteAsync(id);
			return ServiceResponse.success<null>(
				'Leave deleted successfully',
				null
			);
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
				return ServiceResponse.failure('Leave not found', null, StatusCodes.NOT_FOUND);
			}
			console.error(`Error deleting leave: ${(error as Error).message}`);
			return ServiceResponse.failure(
				'An error occurred while deleting leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async deleteExpired(): Promise<void> {
		try {
			const count = await this.leaveRepository.deleteExpiredAsync();
			if (count > 0) {
				console.info(`Deleted ${count} expired leave(s).`);
			}
		} catch (error) {
			console.error(
				`Error deleting expired leaves: ${(error as Error).message}`
			);
		}
	}
}

export const leaveService = new LeaveService();
