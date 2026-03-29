import ContentService from '@/app/services/content';
import type { Informations, ResponseObject, Service } from '@repo/app-types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Services',
	description:
		"Découvrez les services d'ostéopathie animalière proposés par Anna Nischwitz à Bordeaux. Soins à domicile adaptés aux chiens, chats, chevaux et NAC.",
	alternates: {
		canonical: '/services',
	},
	openGraph: {
		title: "Services d'Ostéopathie Animalière | Anna Nischwitz",
		description:
			'Soins ostéopathiques à domicile pour chiens, chats, chevaux et NAC dans la région bordelaise.',
		url: '/services',
	},
};

async function getData() {
	const result: {
		services: Service[];
		informations: Informations | null;
	} = {
		services: [],
		informations: null,
	};

	// --- Services

	const servicesRes = await fetch(`${process.env.API_URL}/services/res`, {
		cache: 'no-cache',
	});
	const servicesResponseData: ResponseObject<Service[]> =
		await servicesRes.json();

	if (servicesResponseData.success) {
		const allServices = servicesResponseData.responseObject;
		result.services = allServices.filter((x) => x.enabled);
	}

	// --- Informations

	const infoRes = await fetch(`${process.env.API_URL}/informations`, {
		cache: 'no-cache',
	});
	const infoResponseData: ResponseObject<Informations> = await infoRes.json();

	if (infoResponseData.success) {
		result.informations = infoResponseData.responseObject;
	}

	return result;
}

export default async function ServicesPage() {
	const data = await getData();

	if (!data.informations) {
		throw new Error('Informations not found');
	}

	return (
		<ContentService
			services={data.services}
			informations={data.informations}
		/>
	);
}
