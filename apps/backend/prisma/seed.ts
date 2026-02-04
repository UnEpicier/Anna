import { exit } from "node:process";
import { categories, posts } from "../src/api/blog/blogRepository";
import { department } from "../src/api/departments/departmentsRepository";
import { informations } from "../src/api/informations/informationsRepository";
import { leave } from "../src/api/leave/leaveRepository";
import { schedule } from "../src/api/schedules/schedulesRepository";
import { service } from "../src/api/services/servicesRepository";
import prisma from "../src/libs/prisma";
import {readFileSync, readdirSync} from "fs";

async function main() {
	const { id: informationsId, ...restInformations } = informations;
	await prisma.informations.upsert({
		where: { id: informationsId },
		update: {},
		create: restInformations,
	});

	const { id: serviceId, ...restService } = service;
	await prisma.services.upsert({
		where: { id: serviceId },
		update: {},
		create: restService,
	});

	await prisma.schedules.upsert({
		where: { day: "monday" },
		update: {},
		create: schedule,
	});
	
	const files = readdirSync(`${process.cwd()}/departments`);
	
	for (const file of files) {
		const fileContent = readFileSync(`${process.cwd()}/departments/${file}`, 'utf-8');
		const departmentData = JSON.parse(fileContent);
		
		const department = {
			code: departmentData.properties.code,
			name: departmentData.properties.name,
			geojson: departmentData,
		}
		
		await prisma.departments.upsert({
			where: { code: department.code },
			update: {},
			create: department,
		});
	}

	const { id: leaveId, ...restLeave } = leave;
	await prisma.leave.upsert({
		where: { id: leaveId },
		update: {},
		create: restLeave,
	});

	for (const category of categories) {
		const { id: categoryId, ...restCategory } = category;
		await prisma.blogCategories.upsert({
			where: { id: categoryId },
			update: {},
			create: {
				...restCategory,
				posts: undefined,
			},
		});
	}

	for (const post of posts) {
		const { id: postId, categories, ...restPost } = post;
		await prisma.blogPosts.upsert({
			where: { id: postId },
			update: {},
			create: {
				...restPost,
				categories: {
					connect: (categories ?? []).map((category) => ({ id: category.id })),
				},
			},
		});
	}
}

(async () => {
	try {
		await main();
		await prisma.$disconnect();
	} catch (error) {
		console.error(error);
		await prisma.$disconnect();
		exit(1);
	}
})();