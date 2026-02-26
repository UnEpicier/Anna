import DepartmentsContent from '@/app/departments/content';
import { Department, ResponseObject } from '@repo/app-types';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/departments`);
	const data: ResponseObject<Department[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject.toSorted(
		(a, b) => parseInt(a.code) - parseInt(b.code),
	);
}

export default async function DepartmentsPage() {
	const data = await getData();

	return <DepartmentsContent departments={data} />;
}
