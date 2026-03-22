import ContactContent from '@/app/(app)/informations/content';
import type { Informations, ResponseObject } from '@repo/app-types';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token ? { Cookie: `token=${token}` } : {};

	const res = await fetch(`${process.env.API_URL}/informations`, { headers: authHeaders });
	const data: ResponseObject<Informations> = await res.json();

	if (!data.success) {
		return null;
	}

	return data.responseObject;
}

export const metadata: Metadata = {
	title: 'Informations',
};

export default async function ContactPage() {
	const data = await getData();

	if (!data) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<p className='text-gray-600 text-lg'>
					Impossible de charger les informations
				</p>
			</div>
		);
	}

	return <ContactContent data={data} />;
}
