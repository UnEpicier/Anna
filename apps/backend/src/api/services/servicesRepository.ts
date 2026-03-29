import type { Service } from '@repo/app-types';
import prisma from '@/libs/prisma';

export class ServicesRepository {
	async findAll(): Promise<Service[]> {
		const services = await prisma.services.findMany();

		return services.map((service) => ({
			...service,
			price: service.price.toNumber(),
		}));
	}

	async createMany(
		data: Omit<Service, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>[]
	): Promise<Service[]> {
		const services = await prisma.services.createManyAndReturn({
			data: data,
		});

		return services.map((service) => ({
			...service,
			price: service.price.toNumber(),
		}));
	}

	async updateMany(data: Partial<Service>[]): Promise<Service[]> {
		const services = await prisma.$transaction(
			data.map(({ id, createdAt: _, updatedAt: __, ...rest }) =>
				prisma.services.update({
					where: { id },
					data: rest,
				})
			)
		);

		return services.map((service) => ({
			...service,
			price: service.price.toNumber(),
		}));
	}

	async delete(id: number): Promise<void> {
		await prisma.services.delete({
			where: {
				id: id,
			},
		});
	}
}
