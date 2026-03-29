import type { Leave, ResponseObject } from '@repo/app-types';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LeaveContent from './content';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token
		? { Cookie: `token=${token}` }
		: {};

	const res = await fetch(`${process.env.API_URL}/leave/all`, {
		headers: authHeaders,
	});
	const data: ResponseObject<Leave[]> = await res.json();

	if (!data.success) return [];
	return data.responseObject;
}

export const metadata: Metadata = {
	title: 'Absences',
};

export default async function LeavePage() {
	const data = await getData();

	return <LeaveContent leaves={data} />;
}
