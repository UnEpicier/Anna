import ScheduleContent from '@/app/schedule/content';
import type { ResponseObject, Schedule } from '@repo/app-types';
import type { Metadata } from 'next';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/schedules`);
	const data: ResponseObject<Schedule[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject.map((schedule) => ({
		...schedule,
		startTime: new Date(schedule.startTime),
		endTime: new Date(schedule.endTime),
	}));
}

export const metadata: Metadata = {
	title: 'Horaires',
};

export default async function SchedulePage() {
	const data = await getData();

	return <ScheduleContent schedules={data} />;
}
