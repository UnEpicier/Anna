import type { ResponseObject, Service } from '@repo/app-types';
import ServicesContent from '@/app/services/content';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/services`);
	const data: ResponseObject<Service[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject;
}

export default async function ServicesPage() {
	const data = await getData();

	return <ServicesContent services={data} />;
}
