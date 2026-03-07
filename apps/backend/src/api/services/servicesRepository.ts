import type { Service } from '@repo/app-types';
import prisma from '@/libs/prisma';

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

	async findById(id: number): Promise<Service | null> {
		const service = await prisma.services.findUnique({
			where: {
				id: id,
			},
		});

		if (!service) {
			return null;
		}

		return {
			...service,
			price: service.price.toNumber(),
		};
	}

	async create(
		data: Omit<Service, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>
	): Promise<Service> {
		const service = await prisma.services.create({
			data: {
				...data,
			},
		});

		return { ...service, price: service.price.toNumber() };
	}

	async update(id: number, data: Partial<Service>): Promise<Service> {
		const service = await prisma.services.update({
			where: {
				id: id,
			},
			data: {
				...data,
			},
		});

		return {
			...service,
			price: service.price.toNumber(),
		};
	}

	async delete(id: number): Promise<void> {
		await prisma.services.delete({
			where: {
				id: id,
			},
		});
	}
}
