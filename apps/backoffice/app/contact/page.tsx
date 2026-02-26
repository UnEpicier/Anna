import { Informations, ResponseObject } from '@repo/app-types';
import ContactContent from '@/app/contact/content';

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
