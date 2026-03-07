import ContactContent from '@/app/informations/content';
import type { Informations, ResponseObject } from '@repo/app-types';

async function getData() {
	const res = await fetch(`${process.env.API_URL}/informations`);
	const data: ResponseObject<Informations> = await res.json();

	if (!data.success) {
		return null;
	}

	return data.responseObject;
}

export default async function ContactPage() {
	const data = await getData();

	return <ContactContent data={data} />;
}
