import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import { LeaveRepository } from '@/api/leave/leaveRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import { Prisma } from '@/generated/prisma-client/client';

function parseDateUTC(value: Date | string): Date {
	if (value instanceof Date) return value;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
	if (match) {
		return new Date(
			Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
		);
	}
	return new Date(value);
}

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
			const newLeave = await this.leaveRepository.createAsync({
				from: parseDateUTC(data.from as Date | string),
				to: parseDateUTC(data.to as Date | string),
			});
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
			const parsed: typeof data = { ...data };
			if (data.from !== undefined)
				parsed.from = parseDateUTC(data.from as Date | string);
			if (data.to !== undefined)
				parsed.to = parseDateUTC(data.to as Date | string);
			const updatedLeave = await this.leaveRepository.updateAsync(
				id,
				parsed
			);
			return ServiceResponse.success<Leave>(
				'Leave updated successfully',
				updatedLeave
			);
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				return ServiceResponse.failure(
					'Leave not found',
					null,
					StatusCodes.NOT_FOUND
				);
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
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				return ServiceResponse.failure(
					'Leave not found',
					null,
					StatusCodes.NOT_FOUND
				);
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
