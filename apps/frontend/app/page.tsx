'use client';

import Button from '@/components/Button';
import { ArrowRight, Award, CheckCircle, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/Card';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import Link from 'next/link';

// Content
const benefits = [
	{
		icon: Heart,
		title: 'Approche Douce',
		description:
			'Une méthode naturelle et non invasive pour le bien-être de vos animaux',
	},
	{
		icon: Clock,
		title: 'Disponibilité',
		description: 'Déplacements à domicile pour le confort de votre animal',
	},
	{
		icon: Award,
		title: 'Expertise',
		description:
			'Diplômée et formée aux techniques ostéopathiques pour tous animaux',
	},
];

const animals = [
	{
		name: 'Chiens',
		description:
			'Prise en charge adaptée à toutes les races et tous les âges',
	},
	{
		name: 'Chats',
		description: 'Soins en douceur dans un environnement familier',
	},
	{
		name: 'NAC',
		description: 'Expertise pour lapins, furets et autres petits animaux',
	},
	{
		name: 'Chevaux',
		description: 'Ostéopathie équine pour améliorer les performances',
	},
];

// Motion
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

export default function Home() {
	return (
		<div className='min-h-screen pt-20'>
			{/* Landing Section */}
			<section className='relative min-h-[90svh] flex items-center overflow-hidden'>
				<div className='absolute inset-0 bg-linear-to-br from-secondary via-white to-primary/5' />
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.7 }}>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className='inline-block px-4 py-2 bg-primary/10 rounded-full mb-6'>
								<span className='text-primary'>
									Ostéopathie Animalière Professionnelle
								</span>
							</motion.div>

							<h1 className='text-5xl md:text-6xl lg:text-7xl text-primary mb-6 leading-tight'>
								Anna Nischwitz
							</h1>
							<h2 className='text-2xl md:text-3xl text-gray-700 mb-8'>
								Ostéopathe Animalier
							</h2>
							<p className='text-lg text-gray-600 mb-10 leading-relaxed'>
								Passionnée par le bien-être animal, je mets mon
								expertise au service de vos compagnons pour
								améliorer leur mobilité, soulager leurs douleurs
								et optimiser leurs performances.
							</p>
							<div className='flex flex-wrap gap-4'>
								<Button
									size='lg'
									className='bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group'
									asChild>
									<Link href='/contact'>
										Prendre Rendez-vous
										<ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
									</Link>
								</Button>
								<Button
									variant='outline'
									size='lg'
									className='border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40'
									asChild>
									<Link href='/services'>
										Découvrir les Services
									</Link>
								</Button>
							</div>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.7, delay: 0.3 }}
							className='relative'>
							<div className='absolute inset-0 bg-linear-to-br from-primary/20 to-transparent rounded-3xl blur-2xl' />

							<div className='relative rounded-3xl overflow-hidden shadow-2xl'>
								<ImageWithFallback
									src='https://images.unsplash.com/photo-1450778869180-41d0601e046e'
									alt='Ostéopathie animalière'
									className='w-full h-125 lg:h-150 object-cover'
								/>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className='py-24 bg-white relative'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Pourquoi Choisir l&apos;Ostéopathie Animalière ?
						</h2>
						<p className='text-gray-600 text-lg max-w-2xl mx-auto'>
							Une approche naturelle et holistique pour la santé
							de vos compagnons
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								variants={itemVariants}>
								<Card className='border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full group bg-linear-to-br from-white to-gray-50/50'>
									<CardContent className='pt-8 pb-8'>
										<div className='bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors'>
											<benefit.icon className='h-8 w-8 text-primary' />
										</div>
										<h3 className='text-xl text-primary mb-3'>
											{benefit.title}
										</h3>
										<p className='text-gray-600 leading-relaxed'>
											{benefit.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* Animals Section */}
			<section className='py-24 bg-linear-to-b from-white to-gray-50 relative'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'>
						<h2 className='text-4xl md:text-5xl text-primary mb-4'>
							Tous Vos Compagnons Sont les Bienvenus
						</h2>
						<p className='text-gray-600 text-lg max-w-2xl mx-auto'>
							J&apos;interviens auprès de différentes espèces
							animales, chacune nécessitant une approche
							spécifique et adaptée.
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{animals.map((animal, index) => (
							<motion.div
								key={index}
								variants={itemVariants}>
								<Card className='border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full group cursor-pointer bg-white'>
									<CardContent className='pt-8 pb-8'>
										<div className='bg-linear-to-br from-primary to-primary/80 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg'>
											<CheckCircle className='h-6 w-6 text-white' />
										</div>
										<h3 className='text-lg text-primary mb-3 group-hover:text-primary/80 transition-colors'>
											{animal.name}
										</h3>
										<p className='text-gray-600 text-sm leading-relaxed'>
											{animal.description}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* About Section */}
			<section className='py-24 bg-white relative overflow-hidden'>
				<div className='absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-secondary to-transparent opacity-30'></div>

				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}
							className='relative'>
							<div className='absolute -inset-4 bg-linear-to-br from-primary/20 to-transparent rounded-3xl blur-2xl'></div>
							<div className='relative rounded-3xl overflow-hidden shadow-2xl'>
								<ImageWithFallback
									src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
									alt='Anna Nischwitz'
									className='w-full h-137.5 object-cover'
								/>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}>
							<h2 className='text-4xl md:text-5xl text-primary mb-8'>
								À Propos de Moi
							</h2>
							<div className='space-y-6 text-gray-600 leading-relaxed'>
								<p>
									Diplômée en ostéopathie animalière, je me
									consacre depuis plusieurs années au
									bien-être de nos compagnons à quatre pattes
									et de nos amis équidés.
								</p>
								<p>
									Ma passion pour les animaux et mon expertise
									me permettent d&apos;identifier et de
									traiter les tensions, blocages et
									déséquilibres qui peuvent affecter la
									qualité de vie de vos animaux.
								</p>
								<p>
									Chaque séance est personnalisée en fonction
									des besoins spécifiques de l&apos;animal,
									dans le respect de son bien-être et de sa
									physiologie.
								</p>
							</div>
							<Button
								className='mt-8 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group'
								size='lg'
								asChild>
								<Link href='/contact'>
									Me Contacter
									<ArrowRight className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
								</Link>
							</Button>
						</motion.div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
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
					<h2 className='text-4xl md:text-5xl mb-8'>
						Prêt à Améliorer le Bien-être de Votre Animal ?
					</h2>
					<p className='text-xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed'>
						Prenez rendez-vous dès aujourd&apos;hui pour une
						consultation personnalisée.
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
