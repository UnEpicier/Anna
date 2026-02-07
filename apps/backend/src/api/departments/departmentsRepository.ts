import prisma from "@/libs/prisma";
import { type Department, GeoJsonSchema } from "@repo/app-types";

export const department: Department = {
	code: "33",
	name: "Gironde",
	geojson: {
		type: 'Feature',
		geometry: {
			type: 'Polygon',
			coordinates: [],
		},
		properties: {}
	},
	active: false,
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};

export class DepartmentsRepository {
	async findAllAsync(): Promise<Department[]> {
		const departments = await prisma.departments.findMany();

		return departments.map((dept) => ({
			...dept,
			geojson: GeoJsonSchema.parse(dept.geojson),
		})) as Department[];
	}

	async findActivesAsync(): Promise<Department[]> {
		const departments = await prisma.departments.findMany({
			where: {
				active: true,
			},
		});
		return departments.map((dept) => ({
			...dept,
			geojson: GeoJsonSchema.parse(dept.geojson),
		})) as Department[];
	}

	async updateAsync(code: string, active: boolean): Promise<Department> {
		const updatedDepartment = await prisma.departments.update({
			where: { code: code },
			data: { active },
		});

		return {
			...updatedDepartment,
			geojson: GeoJsonSchema.parse(updatedDepartment.geojson),
		} as Department;
	}
}
