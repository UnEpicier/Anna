import AnnouncementContent from '@/app/(app)/announcement/content';
import type { PopupMessage, ResponseObject } from '@repo/app-types';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function getData(): Promise<PopupMessage | null> {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get('token')?.value;
		const authHeaders: Record<string, string> = token
			? { Cookie: `token=${token}` }
			: {};

		const res = await fetch(`${process.env.API_URL}/popup-message`, {
			headers: authHeaders,
		});
		if (!res.ok) return null;
		const data: ResponseObject<PopupMessage> = await res.json();

		if (!data.success) return null;
		return data.responseObject;
	} catch {
		return null;
	}
}

export const metadata: Metadata = {
	title: 'Annonce',
};

export default async function AnnouncementPage() {
	const data = await getData();

	if (!data) {
		return (
			<div className='flex items-center justify-center h-screen'>
				<p className='text-gray-600 text-lg'>
					Impossible de charger les données
				</p>
			</div>
		);
	}

	return <AnnouncementContent data={data} />;
}
