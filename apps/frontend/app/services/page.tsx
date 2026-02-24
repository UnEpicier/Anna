import ContentService from '@/app/services/content';
import { Informations, ResponseObject, Service } from '@repo/app-types';

const serviceDetails: Record<string, string[]> = {
	Chiens: [
		'Bilan ostéopathique complet',
		'Traitement des troubles locomoteurs',
		'Amélioration de la mobilité',
		'Conseils personnalisés',
	],
	Chats: [
		'Examen en douceur',
		'Traitement des tensions',
		'Soulagement des douleurs',
		'Suivi personnalisé',
	],
	NAC: [
		'Manipulation délicate',
		'Adaptation à chaque espèce',
		'Traitement préventif et curatif',
		"Conseils d'entretien",
	],
	Chevaux: [
		'Bilan ostéopathique complet',
		'Optimisation des performances',
		'Prévention des blessures',
		'Suivi régulier recommandé',
	],
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

	const servicesRes = await fetch(`${process.env.API_URL}/services`, {
		next: { revalidate: 60 },
	});
	const servicesResponseData: ResponseObject<Service[]> =
		await servicesRes.json();

	if (servicesResponseData.success) {
		const allServices = servicesResponseData.responseObject;
		result.services = allServices.filter((x) => x.enabled);
	}

	// --- Informations

	const infoRes = await fetch(`${process.env.API_URL}/informations`, {
		next: { revalidate: 300 },
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
