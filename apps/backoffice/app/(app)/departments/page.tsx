import DepartmentsContent from '@/app/(app)/departments/content';
import type { Department, ResponseObject } from '@repo/app-types';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token
		? { Cookie: `token=${token}` }
		: {};

	const res = await fetch(`${process.env.API_URL}/departments`, {
		headers: authHeaders,
	});
	const data: ResponseObject<Department[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject.toSorted(
		(a, b) => parseInt(a.code) - parseInt(b.code)
	);
}

export const metadata: Metadata = {
	title: 'Départements',
};

export default async function DepartmentsPage() {
	const data = await getData();

	return <DepartmentsContent departments={data} />;
}
