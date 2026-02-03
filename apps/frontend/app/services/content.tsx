'use client';

import { motion } from 'motion/react';
import {
	ArrowRight,
	Cat,
	CheckCircle2,
	Clock,
	Dog,
	Euro,
	Rabbit,
	Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import Button from '@/components/Button';
import { Service, Informations } from '@/utils/types';

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

const iconMap: Record<string, any> = {
	Chiens: Dog,
	Chats: Cat,
	NAC: Rabbit,
	Chevaux: Sparkles,
};

const indications = [
	'Boiteries et troubles locomoteurs',
	'Raideurs et perte de mobilité',
	'Troubles comportementaux',
	'Post-opératoire et rééducation',
	'Préparation et récupération sportive',
	'Suivi des animaux âgés',
	'Prévention et bien-être général',
];

export default function ContentService({
	services,
	informations,
}: {
	services: Service[];
	informations: Informations;
}) {
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
						Services & Tarifs
					</h1>
					<p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
						Des soins ostéopathiques professionnels adaptés à chaque
						animal. Déplacement à domicile inclus dans un rayon de{' '}
						{informations.actionRadius}km.
					</p>
				</motion.div>
			</section>

			{/* Services Cards */}
			<section className='py-16 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{services.map((service, index) => {
							const IconComponent = iconMap[service.icon] || Dog;

							return (
								<motion.div
									key={index}
									variants={itemVariants}>
									<Card className='border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group bg-linear-to-br from-white to-gray-50/50'>
										<CardHeader>
											<div className='flex items-start justify-between'>
												<div className='flex items-center gap-4'>
													<div className='bg-linear-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform'>
														<IconComponent className='h-8 w-8 text-white' />
													</div>
													<div>
														<CardTitle className='text-3xl text-primary'>
															{service.title}
														</CardTitle>
													</div>
												</div>
											</div>
										</CardHeader>
										<CardContent>
											<p className='text-gray-600 mb-6 leading-relaxed'>
												{service.description}
											</p>

											<div className='flex items-center justify-between mb-8 p-6 bg-linear-to-br from-primary/5 to-transparent rounded-2xl border border-primary/10'>
												<div className='flex items-center gap-3'>
													<div className='bg-primary/10 p-2 rounded-xl'>
														<Euro className='h-6 w-6 text-primary' />
													</div>
													<span className='text-3xl text-primary'>
														{service.price}
													</span>
												</div>
												<div className='flex items-center gap-2 text-gray-600'>
													<Clock className='h-5 w-5' />
													<span>
														{service.duration}
													</span>
												</div>
											</div>

											<p className='space-y-3 mb-6'>
												{service.description}
											</p>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* Indications */}
			<section className='py-24 bg-linear-to-b from-white to-gray-50'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-12'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Quand Consulter un Ostéopathe Animalier ?
						</h2>
						<p className='text-gray-600 text-lg'>
							L'ostéopathie peut aider dans de nombreuses
							situations
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}>
						<Card className='border-0 shadow-xl bg-white'>
							<CardContent className='pt-8 pb-8'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{indications.map((indication, index) => (
										<div
											key={index}
											className='flex items-start gap-4 group'>
											<div className='bg-primary/10 rounded-xl p-2 group-hover:bg-primary/20 transition-colors'>
												<div className='w-2 h-2 bg-primary rounded-full'></div>
											</div>
											<p className='text-gray-700 leading-relaxed'>
												{indication}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* Additional Info */}
			<section className='py-24 bg-white'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<Card className='border-0 shadow-lg h-full bg-linear-to-br from-secondary to-white'>
								<CardContent className='pt-8 pb-8'>
									<div className='bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6'>
										<ArrowRight className='h-6 w-6 text-primary' />
									</div>
									<h3 className='text-2xl text-primary mb-6'>
										Déplacements
									</h3>
									<p className='text-gray-600 mb-6 leading-relaxed'>
										Je me déplace à votre domicile ou dans
										votre écurie pour le confort de votre
										animal.
									</p>
									<div className='bg-white/60 rounded-xl p-4'>
										<p className='text-gray-700'>
											<strong className='text-primary'>
												Zone d'intervention :
											</strong>
											<br />
											Rayon de {informations.actionRadius}
											km autour de{' '}
											{informations.actionAddress}.
										</p>
										<p className='text-gray-600 mt-2'>
											Au-delà, frais de déplacement :
											0,50€/km supplémentaire.
										</p>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							<Card className='border-0 shadow-lg h-full bg-linear-to-br from-secondary to-white'>
								<CardContent className='pt-8 pb-8'>
									<div className='bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6'>
										<CheckCircle2 className='h-6 w-6 text-primary' />
									</div>
									<h3 className='text-2xl text-primary mb-6'>
										Informations Pratiques
									</h3>
									<div className='space-y-4'>
										<div className='bg-white/60 rounded-xl p-4'>
											<p className='text-gray-700'>
												<strong className='text-primary'>
													Paiement :
												</strong>
												<br />
												Espèces, chèque, carte bleue
											</p>
										</div>
										<div className='bg-white/60 rounded-xl p-4'>
											<p className='text-gray-700'>
												<strong className='text-primary'>
													Annulation :
												</strong>
												<br />
												48h à l'avance sans frais
											</p>
										</div>
										<div className='bg-white/60 rounded-xl p-4'>
											<p className='text-gray-700'>
												<strong className='text-primary'>
													Suivi :
												</strong>
												<br />
												Compte-rendu écrit après chaque
												séance
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
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
						Des Questions sur les Tarifs ?
					</h2>
					<p className='text-xl mb-10 opacity-95 max-w-2xl mx-auto'>
						N'hésitez pas à me contacter pour toute information
						complémentaire.
					</p>
					<Button
						size='lg'
						variant='secondary'
						className='bg-white text-primary hover:bg-gray-100 shadow-2xl hover:shadow-xl transition-all hover:scale-105'>
						Me Contacter
						<ArrowRight className='ml-2 h-5 w-5' />
					</Button>
				</motion.div>
			</section>
		</div>
	);
}
