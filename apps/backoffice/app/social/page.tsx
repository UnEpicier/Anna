import SocialContent from '@/app/social/content';
import type { Informations, ResponseObject } from '@repo/app-types';
import type { Metadata } from 'next';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/informations`);
	const data: ResponseObject<Informations> = await res.json();

	return {
		facebook: data.responseObject?.facebook ?? '',
		instagram: data.responseObject?.instagram ?? '',
	};
}

export const metadata: Metadata = {
	title: 'Réseaux sociaux',
};

export default async function SocialPage() {
	const data = await getData();

	return <SocialContent socials={data} />;
}
