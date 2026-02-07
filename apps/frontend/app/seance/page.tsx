'use client';

import { Button, Card, CardContent, ImageWithFallback } from '@repo/ui';
import {
	ArrowRight,
	CalendarCheck,
	CheckCircle,
	Clock,
	Eye,
	FileText,
	Hand,
	MessageSquare,
	Stethoscope,
} from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function SeanceTypePage() {
	const steps = [
		{
			icon: FileText,
			title: '1. Anamnèse et Prise de Contact',
			duration: '10-15 min',
			description:
				"Je commence par échanger avec vous pour comprendre l'historique de votre animal, ses habitudes, son mode de vie et la raison de la consultation.",
			details: [
				'Motif de consultation',
				'Historique médical et vétérinaire',
				'Mode de vie et environnement',
				'Alimentation et activité physique',
				'Comportements observés',
			],
		},
		{
			icon: Eye,
			title: '2. Observation Statique et Dynamique',
			duration: '5-10 min',
			description:
				"J'observe votre animal au repos et en mouvement pour détecter les déséquilibres posturaux et les troubles de la locomotion.",
			details: [
				'Posture générale',
				'Appuis et équilibre',
				'Observation de la marche',
				'Détection des asymétries',
				'Analyse du comportement',
			],
		},
		{
			icon: Stethoscope,
			title: '3. Examen Ostéopathique Complet',
			duration: '15-20 min',
			description:
				"À l'aide de techniques manuelles douces, j'évalue la mobilité de toutes les structures du corps de votre animal.",
			details: [
				"Palpation de l'ensemble du corps",
				'Tests de mobilité articulaire',
				'Évaluation des tensions musculaires',
				'Recherche de zones de restriction',
				'Bilan ostéopathique complet',
			],
		},
		{
			icon: Hand,
			title: '4. Traitement Ostéopathique',
			duration: '20-30 min',
			description:
				'Je procède au traitement des dysfonctions détectées grâce à des techniques adaptées à votre animal et à son état.',
			details: [
				'Techniques douces et non invasives',
				'Manipulations articulaires',
				'Relâchement des tensions musculaires',
				'Équilibration du système nerveux',
				"Respect du rythme de l'animal",
			],
		},
		{
			icon: MessageSquare,
			title: '5. Conseils et Recommandations',
			duration: '5-10 min',
			description:
				'Je vous donne des conseils personnalisés pour optimiser les bénéfices de la séance et prendre soin de votre animal au quotidien.',
			details: [
				'Temps de repos recommandé',
				'Exercices adaptés',
				'Conseils posturaux',
				"Adaptation de l'environnement",
				'Prévention et suivi',
			],
		},
		{
			icon: CalendarCheck,
			title: '6. Suivi Post-Séance',
			duration: 'Après la séance',
			description:
				"Je reste disponible pour répondre à vos questions et assurer un suivi de l'évolution de votre animal.",
			details: [
				'Compte-rendu écrit de la séance',
				'Disponibilité pour questions',
				'Planification du suivi si nécessaire',
				'Coordination avec le vétérinaire',
				"Suivi de l'évolution",
			],
		},
	];

	const importantPoints = [
		{
			icon: Clock,
			title: 'Durée de la séance',
			text: "Une séance dure généralement entre 45 minutes et 1h30 selon l'espèce et les besoins de l'animal.",
		},
		{
			icon: Hand,
			title: 'Approche douce',
			text: 'Toutes les manipulations sont réalisées dans le respect du bien-être et du confort de votre animal.',
		},
		{
			icon: CheckCircle,
			title: 'Complémentarité',
			text: "L'ostéopathie ne se substitue pas à la médecine vétérinaire mais la complète parfaitement.",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<div className='min-h-screen pt-20'>
			{/* Header */}
			<section className='relative py-24 overflow-hidden'>
				<div className='absolute inset-0 bg-linear-to-br from-secondary via-white to-primary/5'></div>
				<div className='absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl'></div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h1 className='text-5xl md:text-6xl text-primary mb-6'>
						Déroulement d&apos;une Séance
					</h1>
					<p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
						Découvrez comment se déroule une séance
						d&apos;ostéopathie pour votre animal, étape par étape.
					</p>
				</motion.div>
			</section>

			{/* Introduction */}
			<section className='py-16 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<h2 className='text-4xl text-primary mb-6'>
								Une Approche Globale et Personnalisée
							</h2>
							<p className='text-gray-600 mb-6 leading-relaxed'>
								Chaque séance est unique car elle est adaptée
								aux besoins spécifiques de votre animal. Mon
								objectif est d&apos;identifier et de traiter les
								causes des déséquilibres pour améliorer
								durablement son bien-être.
							</p>
							<p className='text-gray-600 leading-relaxed'>
								Je travaille en collaboration avec votre
								vétérinaire pour assurer une prise en charge
								complète et optimale de votre compagnon.
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							whileInView={{ opacity: 1, scale: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className='relative'>
							<div className='absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-3xl blur-2xl'></div>
							<div className='relative rounded-3xl overflow-hidden shadow-2xl'>
								<ImageWithFallback
									src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
									alt="Séance d'ostéopathie animalière"
									className='w-full h-80 lg:h-96 object-cover'
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Steps */}
			<section className='py-24 bg-linear-to-b from-white to-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Les Étapes de la Séance
						</h2>
						<p className='text-gray-600 text-lg'>
							Un processus structuré pour des résultats optimaux
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='space-y-6'>
						{steps.map((step, index) => (
							<motion.div
								key={index}
								variants={itemVariants}>
								<Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white'>
									<CardContent className='p-8'>
										<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
											<div className='lg:col-span-1 flex justify-center lg:justify-start'>
												<div className='bg-linear-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform'>
													<step.icon className='h-8 w-8 text-white' />
												</div>
											</div>
											<div className='lg:col-span-11'>
												<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
													<h3 className='text-2xl text-primary mb-2 sm:mb-0'>
														{step.title}
													</h3>
													<span className='inline-flex items-center px-4 py-2 rounded-full text-sm bg-primary/10 text-primary border border-primary/20'>
														<Clock className='h-4 w-4 mr-2' />
														{step.duration}
													</span>
												</div>
												<p className='text-gray-700 mb-6 leading-relaxed'>
													{step.description}
												</p>
												<ul className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
													{step.details.map(
														(detail, idx) => (
															<li
																key={idx}
																className='flex items-start gap-3 text-gray-600'>
																<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
																<span>
																	{detail}
																</span>
															</li>
														),
													)}
												</ul>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Important Points */}
			<section className='py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Points Importants
						</h2>
						<p className='text-gray-600 text-lg'>
							Ce qu&apos;il faut savoir avant la séance
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{importantPoints.map((point, index) => (
							<motion.div
								key={index}
								variants={itemVariants}>
								<Card className='text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full bg-linear-to-br from-white to-gray-50/50'>
									<CardContent className='pt-10 pb-10'>
										<div className='inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-primary/80 rounded-2xl shadow-lg mb-6'>
											<point.icon className='h-10 w-10 text-white' />
										</div>
										<h3 className='text-xl text-primary mb-4'>
											{point.title}
										</h3>
										<p className='text-gray-600 leading-relaxed'>
											{point.text}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Preparation */}
			<section className='py-24 bg-linear-to-b from-white to-secondary'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-12'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Comment Préparer la Séance ?
						</h2>
						<p className='text-gray-600 text-lg'>
							Quelques conseils pour optimiser la consultation
						</p>
					</motion.div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<Card className='border-0 shadow-lg h-full bg-white'>
								<CardContent className='pt-8 pb-8'>
									<h3 className='text-2xl text-primary mb-6'>
										Avant la Séance
									</h3>
									<ul className='space-y-4 text-gray-600'>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Préparez les documents
												vétérinaires (radios,
												examens...)
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Notez les comportements
												inhabituels observés
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Prévoyez un espace calme pour la
												séance
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Évitez de nourrir l&apos;animal
												juste avant
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<Card className='border-0 shadow-lg h-full bg-white'>
								<CardContent className='pt-8 pb-8'>
									<h3 className='text-2xl text-primary mb-6'>
										Après la Séance
									</h3>
									<ul className='space-y-4 text-gray-600'>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Laissez votre animal se reposer
												24-48h
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Évitez les efforts intenses
												pendant 2-3 jours
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												Surveillez l&apos;évolution et
												notez les changements
											</span>
										</li>
										<li className='flex items-start gap-3'>
											<CheckCircle className='h-5 w-5 text-primary mt-0.5 shrink-0' />
											<span>
												N&apos;hésitez pas à me
												contacter en cas de question
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className='py-24 bg-white'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-12'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Questions Fréquentes
						</h2>
						<p className='text-gray-600 text-lg'>
							Les réponses à vos interrogations
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='space-y-6'>
						{[
							{
								q: 'Mon animal va-t-il avoir mal pendant la séance ?',
								a: 'Non, les techniques utilisées sont douces et non invasives. Votre animal peut ressentir un léger inconfort lors de la libération de certaines tensions, mais cela reste très bref et sans douleur.',
							},
							{
								q: 'Combien de séances sont nécessaires ?',
								a: "Cela dépend de chaque animal et de sa problématique. Une seule séance peut suffire pour un problème ponctuel, tandis qu'un suivi régulier (2 à 4 fois par an) est recommandé pour les animaux sportifs ou âgés.",
							},
							{
								q: 'Quand vais-je voir les résultats ?',
								a: "Les effets peuvent être immédiats ou se manifester dans les 48 à 72 heures suivant la séance. Le corps de l'animal a besoin de temps pour intégrer les corrections effectuées.",
							},
						].map((faq, index) => (
							<motion.div
								key={index}
								variants={itemVariants}>
								<Card className='border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white'>
									<CardContent className='pt-6 pb-6'>
										<h3 className='text-lg text-primary mb-3'>
											{faq.q}
										</h3>
										<p className='text-gray-600 leading-relaxed'>
											{faq.a}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* CTA */}
			<section className='py-24 bg-linear-to-br from-primary via-primary/95 to-primary/90 text-white relative overflow-hidden'>
				<div className='absolute inset-0 opacity-10'>
					<div className='absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl'></div>
					<div className='absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl'></div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-4xl md:text-5xl mb-6'>
						Prêt à Réserver une Séance ?
					</h2>
					<p className='text-xl mb-10 opacity-95 max-w-2xl mx-auto'>
						Prenez rendez-vous dès maintenant pour améliorer le
						bien-être de votre animal.
					</p>
					<Button
						size='lg'
						variant='secondary'
						className='bg-white text-primary hover:bg-gray-100 shadow-2xl hover:shadow-xl transition-all hover:scale-105'
						asChild>
						<Link href='/contact'>
							Prendre Rendez-vous
							<ArrowRight className='ml-2 h-5 w-5' />
						</Link>
					</Button>
				</motion.div>
			</section>
		</div>
	);
}
