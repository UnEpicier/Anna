import HomeContent from '@/app/content';
import type { ResponseObject, Service } from '@repo/app-types';

async function getData(): Promise<Service[]> {
	const res = await fetch(`${process.env.API_URL}/services`, {
		cache: 'no-store',
	});
	const data: ResponseObject<Service[]> = await res.json();
	if (!data.success) return [];
	return data.responseObject.filter((s) => s.enabled);
}

export default async function Home() {
	const services = await getData();
	return <HomeContent services={services} />;
}
