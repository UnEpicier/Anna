import { readdirSync, readFileSync } from 'node:fs';
import { exit } from 'node:process';
import prisma from '../src/libs/prisma.js';
import { informations } from './data/informations.js';
import { leave } from './data/leave.js';
import { schedules } from './data/schedules.js';
import { services } from './data/services.js';

async function main() {
	const { id: informationsId, ...restInformations } = informations;
	await prisma.informations.upsert({
		where: { id: informationsId },
		update: restInformations,
		create: { id: informationsId, ...restInformations },
	});

	for (const service of services) {
		const { id: serviceId, ...restService } = service;
		await prisma.services.upsert({
			where: { id: serviceId },
			update: restService,
			create: { id: serviceId, ...restService },
		});
	}

	for (const schedule of schedules) {
		const { day, ...restSchedule } = schedule;
		await prisma.schedules.upsert({
			where: { day },
			update: restSchedule,
			create: schedule,
		});
	}

	const files = readdirSync(`${process.cwd()}/departments`);

	for (const file of files) {
		const fileContent = readFileSync(
			`${process.cwd()}/departments/${file}`,
			'utf-8'
		);
		const departmentData = JSON.parse(fileContent);

		const department = {
			code: departmentData.properties.code,
			name: departmentData.properties.name,
			geojson: departmentData,
		};

		await prisma.departments.upsert({
			where: { code: department.code },
			update: {},
			create: department,
		});
	}

	const { id: leaveId, ...restLeave } = leave;
	await prisma.leave.upsert({
		where: { id: leaveId },
		update: restLeave,
		create: { id: leaveId, ...restLeave },
	});
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
