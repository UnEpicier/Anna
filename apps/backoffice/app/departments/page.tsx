import DepartmentsContent from '@/app/departments/content';
import type { Department, ResponseObject } from '@repo/app-types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/departments`);
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
