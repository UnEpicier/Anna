import prisma from '@/libs/prisma';
import type { Service } from '@repo/app-types';

export const service: Service = {
	id: 1,
	title: 'Chat',
	icon: 'cat',
	price: 60,
	duration: '1h',
	description: '',
	enabled: true,
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};

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
			data.map((service) =>
				prisma.services.update({
					where: {
						id: service.id,
					},
					data: service,
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
