import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import { LeaveRepository } from '@/api/leave/leaveRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';

export class LeaveService {
	private leaveRepository: LeaveRepository;

	constructor(repository: LeaveRepository = new LeaveRepository()) {
		this.leaveRepository = repository;
	}

	async find(): Promise<ServiceResponse<Leave | null>> {
		try {
			const leave = await this.leaveRepository.findAsync();
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

	async create(
		data: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ServiceResponse<Leave | null>> {
		try {
			const leaveExists = await this.leaveRepository.findAsync();
			if (leaveExists) {
				return ServiceResponse.failure(
					'Leave already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

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

	async update(data: Partial<Leave>): Promise<ServiceResponse<Leave | null>> {
		try {
			const leaveExists = await this.leaveRepository.findAsync();
			if (!leaveExists) {
				return ServiceResponse.failure(
					'Leave not found',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			const updatedLeave = await this.leaveRepository.updateAsync(data);
			return ServiceResponse.success<Leave>(
				'Leave updated successfully',
				updatedLeave
			);
		} catch (error) {
			const errorMessage = `Error updating leave: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async delete(): Promise<ServiceResponse<Leave | null>> {
		try {
			const leaveExists = await this.leaveRepository.findAsync();
			if (!leaveExists) {
				return ServiceResponse.failure(
					'Leave not found',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			await this.leaveRepository.deleteAsync();
			return ServiceResponse.success<null>(
				'Leave deleted successfully',
				null
			);
		} catch (error) {
			const errorMessage = `Error deleting leave: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while deleting leave.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const leaveService = new LeaveService();
