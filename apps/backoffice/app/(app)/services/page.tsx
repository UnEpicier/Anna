import ServicesContent from '@/app/(app)/services/content';
import type { ResponseObject, Service } from '@repo/app-types';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token ? { Cookie: `token=${token}` } : {};

	const res = await fetch(`${process.env.API_URL}/services`, { headers: authHeaders });
	const data: ResponseObject<Service[]> = await res.json();

	if (!data.success) {
		return [];
	}

	return data.responseObject;
}

export const metadata: Metadata = {
	title: 'Services',
};

export default async function ServicesPage() {
	const data = await getData();

	return <ServicesContent services={data} />;
}
