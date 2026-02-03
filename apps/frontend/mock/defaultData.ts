export interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	date: string;
	image: string;
	category: string;
	content: Array<{
		type: 'paragraph' | 'heading';
		text: string;
	}>;
}

export interface Service {
	animal: string;
	description: string;
	price: string;
	duration: string;
	enabled: boolean;
}

export interface ContactInfo {
	phone: string;
	email: string;
	address: string;
	interventionRadius: string;
	departments: string[];
}

export interface Schedule {
	days: string;
	hours: string;
	sundayAvailable: boolean;
}

export interface SocialLinks {
	facebook: string;
	instagram: string;
}

interface SiteData {
	contactInfo: ContactInfo;
	schedule: Schedule;
	socialLinks: SocialLinks;
	services: Service[];
	categories: string[];
	blogPosts: BlogPost[];
}

export const siteData: SiteData = {
	contactInfo: {
		phone: '06 XX XX XX XX',
		email: 'contact@anna-nischwitz.fr',
		address: '[Ville]',
		interventionRadius: '30km',
		departments: [],
	},
	schedule: {
		days: 'Lun - Sam',
		hours: '8h - 19h',
		sundayAvailable: true,
	},
	socialLinks: {
		facebook: '#',
		instagram: '#',
	},
	services: [
		{
			animal: 'Chiens',
			description:
				"Séance d'ostéopathie adaptée à toutes les races et tous les âges, du chiot au senior.",
			price: '60€',
			duration: '45-60 min',
			enabled: true,
		},
		{
			animal: 'Chats',
			description:
				'Approche douce et respectueuse pour nos amis félins, dans leur environnement familier.',
			price: '55€',
			duration: '30-45 min',
			enabled: true,
		},
		{
			animal: 'NAC',
			description:
				"Soins spécialisés pour lapins, furets, cochons d'Inde et autres nouveaux animaux de compagnie.",
			price: '50€',
			duration: '30-40 min',
			enabled: true,
		},
		{
			animal: 'Chevaux',
			description:
				'Ostéopathie équine pour améliorer les performances et le confort de votre cheval.',
			price: '80€',
			duration: '60-90 min',
			enabled: true,
		},
	],
	categories: ['Chiens', 'Chats', 'NAC', 'Chevaux', 'Conseils'],
	blogPosts: [
		{
			id: 'osteopathie-chien-age',
			title: "L'Ostéopathie pour les Chiens Âgés",
			excerpt:
				"Découvrez comment l'ostéopathie peut améliorer la qualité de vie de votre chien senior et soulager les douleurs liées à l'arthrose.",
			date: '15 Mars 2025',
			image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
			category: 'Chiens',
			content: [
				{
					type: 'paragraph',
					text: "Avec l'âge, nos fidèles compagnons canins peuvent développer diverses douleurs et raideurs qui affectent leur qualité de vie. L'ostéopathie représente une solution naturelle et efficace pour améliorer leur confort au quotidien.",
				},
				{
					type: 'heading',
					text: 'Les Signes de Vieillissement chez le Chien',
				},
				{
					type: 'paragraph',
					text: 'Les chiens âgés peuvent présenter plusieurs symptômes qui indiquent un besoin de soins ostéopathiques : difficulté à se lever, boiteries, raideur après le repos, réticence à monter les escaliers ou à sauter.',
				},
				{
					type: 'heading',
					text: "Comment l'Ostéopathie Peut Aider",
				},
				{
					type: 'paragraph',
					text: "L'ostéopathie aide à soulager l'arthrose, améliore la mobilité articulaire, réduit les tensions musculaires et stimule la circulation sanguine. Les manipulations douces permettent de redonner de la souplesse aux articulations et de diminuer les compensations posturales.",
				},
				{
					type: 'heading',
					text: 'Fréquence des Séances',
				},
				{
					type: 'paragraph',
					text: "Pour un chien senior, il est recommandé de consulter un ostéopathe tous les 3 à 6 mois, selon les besoins spécifiques de l'animal. Un suivi régulier permet de maintenir une bonne qualité de vie et de prévenir l'aggravation des symptômes.",
				},
			],
		},
		{
			id: 'preparation-sportive-cheval',
			title: 'Préparer son Cheval pour la Compétition',
			excerpt:
				"L'ostéopathie équine joue un rôle crucial dans la préparation physique et mentale de votre cheval avant une compétition.",
			date: '8 Mars 2025',
			image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a',
			category: 'Chevaux',
			content: [
				{
					type: 'paragraph',
					text: "La préparation d'un cheval pour une compétition ne se limite pas à l'entraînement physique. L'ostéopathie équine joue un rôle essentiel dans l'optimisation des performances et la prévention des blessures.",
				},
				{
					type: 'heading',
					text: "L'Importance d'un Suivi Ostéopathique Régulier",
				},
				{
					type: 'paragraph',
					text: "Un cheval en compétition est soumis à des contraintes physiques importantes. Un suivi ostéopathique régulier permet de détecter et corriger les déséquilibres avant qu'ils ne deviennent problématiques.",
				},
				{
					type: 'heading',
					text: 'Quand Consulter Avant une Compétition',
				},
				{
					type: 'paragraph',
					text: "L'idéal est de planifier une séance d'ostéopathie 7 à 10 jours avant la compétition. Cela laisse le temps au corps du cheval de s'adapter aux corrections effectuées tout en bénéficiant des effets optimaux du traitement le jour J.",
				},
				{
					type: 'heading',
					text: 'Les Bienfaits pour les Performances',
				},
				{
					type: 'paragraph',
					text: "L'ostéopathie améliore l'amplitude de mouvement, optimise la respiration, réduit les tensions musculaires et améliore la concentration du cheval. Un cheval libéré de ses blocages est plus à l'écoute et plus performant.",
				},
			],
		},
		{
			id: 'signes-consulter',
			title: "5 Signes que Votre Animal a Besoin d'un Ostéopathe",
			excerpt:
				"Apprenez à reconnaître les signaux qui indiquent qu'une consultation ostéopathique pourrait être bénéfique pour votre compagnon.",
			date: '1 Mars 2025',
			image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e',
			category: 'Conseils',
			content: [
				{
					type: 'paragraph',
					text: "Nos animaux ne peuvent pas nous dire quand ils ont mal. Il est donc important de savoir reconnaître les signes qui indiquent qu'une consultation ostéopathique serait bénéfique.",
				},
				{
					type: 'heading',
					text: '1. Changements de Comportement',
				},
				{
					type: 'paragraph',
					text: "Un animal qui devient plus irritable, refuse soudainement certaines activités qu'il aimait, ou semble moins enjoué peut souffrir de douleurs que l'ostéopathie peut soulager.",
				},
				{
					type: 'heading',
					text: '2. Boiteries ou Démarche Anormale',
				},
				{
					type: 'paragraph',
					text: "Même une légère boiterie ou une démarche inhabituelle mérite attention. L'ostéopathie peut identifier et traiter la cause sous-jacente avant que le problème ne s'aggrave.",
				},
				{
					type: 'heading',
					text: '3. Raideur au Lever',
				},
				{
					type: 'paragraph',
					text: "Si votre animal a du mal à se lever après le repos, surtout le matin, cela peut indiquer des tensions musculaires ou articulaires que l'ostéopathie peut améliorer.",
				},
				{
					type: 'heading',
					text: '4. Perte de Performance',
				},
				{
					type: 'paragraph',
					text: 'Pour les animaux sportifs, une baisse inexpliquée des performances peut être liée à des déséquilibres ostéopathiques qui limitent leurs capacités.',
				},
				{
					type: 'heading',
					text: '5. Après un Traumatisme',
				},
				{
					type: 'paragraph',
					text: "Suite à une chute, un accident ou même une chirurgie, l'ostéopathie aide à la récupération et prévient l'installation de compensations posturales.",
				},
			],
		},
		{
			id: 'osteopathie-chat',
			title: "L'Ostéopathie Féline : Une Approche Douce",
			excerpt:
				"Les chats sont des animaux particulièrement sensibles. Découvrez comment l'ostéopathie s'adapte à leurs besoins spécifiques.",
			date: '22 Février 2025',
			image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba',
			category: 'Chats',
			content: [],
		},
		{
			id: 'osteopathie-preventive',
			title: "L'Ostéopathie Préventive : Pourquoi et Quand ?",
			excerpt:
				"L'ostéopathie ne se limite pas au traitement de la douleur. Elle joue aussi un rôle important dans la prévention des troubles.",
			date: '15 Février 2025',
			image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42',
			category: 'Conseils',
			content: [],
		},
		{
			id: 'nac-osteopathie',
			title: "Les NAC et l'Ostéopathie : Ce qu'il Faut Savoir",
			excerpt:
				"Lapins, furets, cochons d'Inde... Les nouveaux animaux de compagnie peuvent également bénéficier de soins ostéopathiques adaptés.",
			date: '8 Février 2025',
			image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308',
			category: 'NAC',
			content: [],
		},
	],
};
