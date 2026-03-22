import ScheduleContent from '@/app/(app)/schedule/content';
import type { ResponseObject, Schedule } from '@repo/app-types';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token ? { Cookie: `token=${token}` } : {};

	const res = await fetch(`${process.env.API_URL}/schedules`, { headers: authHeaders });
	const data: ResponseObject<Schedule[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject;
}

export const metadata: Metadata = {
	title: 'Horaires',
};

export default async function SchedulePage() {
	const data = await getData();

	return <ScheduleContent schedules={data} />;
}
