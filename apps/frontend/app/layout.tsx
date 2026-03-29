import Footer from '@/ui/Footer';
import LeaveBanner from '@/ui/LeaveBanner';
import Navbar from '@/ui/Navbar';
import type { Informations, ResponseObject, Service } from '@repo/app-types';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

const SITE_URL = 'https://anna-nischwitz.fr';

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#ffffff' },
	],
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: 'Anna Nischwitz - Ostéopathe Animalier à Bordeaux',
		template: '%s | Anna Nischwitz',
	},
	description:
		'Anna Nischwitz, ostéopathe animalier diplômée à Bordeaux. Soins à domicile pour chiens, chats, chevaux et NAC. Améliorez la mobilité et le bien-être de votre animal.',
	keywords: [
		'ostéopathe animalier',
		'ostéopathie animalière',
		'ostéopathe animaux Bordeaux',
		'ostéopathie chien',
		'ostéopathie chat',
		'ostéopathie cheval',
		'ostéopathie équine',
		'ostéopathie NAC',
		'Anna Nischwitz',
		'bien-être animal',
		'soin animal Bordeaux',
		'ostéopathe à domicile',
	],
	authors: [{ name: 'Anna Nischwitz' }],
	creator: 'Anna Nischwitz',
	openGraph: {
		type: 'website',
		locale: 'fr_FR',
		url: SITE_URL,
		siteName: 'Anna Nischwitz - Ostéopathe Animalier',
		title: 'Anna Nischwitz - Ostéopathe Animalier à Bordeaux',
		description:
			'Ostéopathe animalier diplômée à Bordeaux. Soins à domicile pour chiens, chats, chevaux et NAC.',
		images: [
			{
				// TODO: Replace with actual OG image (1200x630px)
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'Anna Nischwitz - Ostéopathe Animalier à Bordeaux',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Anna Nischwitz - Ostéopathe Animalier à Bordeaux',
		description:
			'Ostéopathe animalier diplômée à Bordeaux. Soins à domicile pour chiens, chats, chevaux et NAC.',
		images: ['/og-image.png'],
	},
	alternates: {
		canonical: '/',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
};

async function getJsonLdData(): Promise<{
	informations: Informations | null;
	services: Service[];
}> {
	try {
		const [infoRes, servicesRes] = await Promise.all([
			fetch(`${process.env.API_URL}/informations`, {
				next: { revalidate: 3600 },
			}),
			fetch(`${process.env.API_URL}/services`, {
				next: { revalidate: 3600 },
			}),
		]);

		const infoData: ResponseObject<Informations> = await infoRes.json();
		const servicesData: ResponseObject<Service[]> =
			await servicesRes.json();

		return {
			informations: infoData.success ? infoData.responseObject : null,
			services: servicesData.success
				? servicesData.responseObject.filter((s) => s.enabled)
				: [],
		};
	} catch {
		return { informations: null, services: [] };
	}
}

function buildJsonLd(informations: Informations | null, services: Service[]) {
	const sameAs = [informations?.facebook, informations?.instagram].filter(
		Boolean
	) as string[];

	return {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		'@id': SITE_URL,
		name: 'Anna Nischwitz - Ostéopathe Animalier',
		description:
			'Ostéopathe animalier diplômée proposant des soins à domicile pour chiens, chats, chevaux et NAC dans la région bordelaise.',
		url: SITE_URL,
		telephone: informations?.phone ?? undefined,
		email: informations?.email ?? undefined,
		image: `${SITE_URL}/og-image.png`,
		priceRange: '€€',
		...(informations?.address && {
			address: {
				'@type': 'PostalAddress',
				streetAddress: informations.address,
				addressRegion: 'Nouvelle-Aquitaine',
				addressCountry: 'FR',
			},
		}),
		...(informations && {
			geo: {
				'@type': 'GeoCoordinates',
				latitude: informations.actionLat,
				longitude: informations.actionLong,
			},
			areaServed: {
				'@type': 'GeoCircle',
				geoMidpoint: {
					'@type': 'GeoCoordinates',
					latitude: informations.actionLat,
					longitude: informations.actionLong,
				},
				geoRadius: informations.actionRadius * 1000,
			},
		}),
		serviceType: [
			'Ostéopathie animalière',
			'Ostéopathie équine',
			'Soins à domicile pour animaux',
		],
		makesOffer: services.map((service) => ({
			'@type': 'Offer',
			itemOffered: {
				'@type': 'Service',
				name: service.title,
				description: service.description,
			},
			price: service.price,
			priceCurrency: 'EUR',
		})),
		...(sameAs.length > 0 && { sameAs }),
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const { informations, services } = await getJsonLdData();
	const jsonLd = buildJsonLd(informations, services);

	return (
		<html
			lang='fr'
			data-scroll-behavior='smooth'
		>
			<body>
				<script
					type='application/ld+json'
					suppressHydrationWarning
				>
					{JSON.stringify(jsonLd)}
				</script>
				<div className='min-h-screen flex flex-col'>
					<LeaveBanner />
					<Navbar />
					<main
						data-landmark-index='1'
						className='flex-1'
					>
						{children}
					</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
