'use client';

import { Button, Card, CardContent, ImageWithFallback } from '@repo/ui';
import { ArrowRight, Award, CheckCircle, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';
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
		<div className='min-h-screen'>
			{/* Hero */}
			<section className='relative min-h-svh flex flex-col overflow-hidden'>
				{/* Image de fond */}
				<div className='absolute inset-0'>
					<ImageWithFallback
						src='https://images.unsplash.com/photo-1450778869180-41d0601e046e'
						alt='Ostéopathie animalière'
						className='w-full h-full object-cover brightness-90'
					/>
					<div className='absolute inset-0 bg-linear-to-t from-[rgba(8,5,3,0.92)] via-[rgba(8,5,3,0.4)] to-transparent' />
				</div>

				{/* Badge flottant centré en haut */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='relative z-10 flex justify-center pt-8'
				>
					<span className='px-4 py-2 text-[10px] tracking-[2px] uppercase text-white/80 border border-white/20 rounded-full backdrop-blur-sm bg-white/5'>
						Ostéopathie Animalière · Bordeaux
					</span>
				</motion.div>

				{/* Spacer */}
				<div className='flex-1' />

				{/* Contenu ancré en bas */}
				<div className='relative z-10 px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className='flex items-center gap-3 mb-4'
					>
						<span className='w-6 h-px bg-[#c4956a]/70' />
						<span className='text-[10px] tracking-[2px] uppercase text-[#c4956a]/90'>
							Ostéopathe Animalier Diplômée
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className='text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-4'
					>
						Anna<br />
						<em className='not-italic font-light text-white/60'>Nischwitz</em>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.65 }}
						className='text-sm text-white/55 leading-relaxed mb-6 max-w-sm'
					>
						Soins à domicile pour améliorer la mobilité, soulager les douleurs
						et optimiser le bien-être de vos animaux.
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.8 }}
						className='flex flex-wrap items-center gap-3'
					>
						<Button
							size='lg'
							className='bg-primary hover:bg-primary/90 text-white font-bold shadow-lg'
							asChild
						>
							<Link href='/contact'>
								Prendre Rendez-vous
								<ArrowRight className='ml-2 h-4 w-4' />
							</Link>
						</Button>
						<button
							onClick={() => document.getElementById('below-hero')?.scrollIntoView({ behavior: 'smooth' })}
							className='text-sm text-white/40 flex items-center gap-1 hover:text-white/60 transition-colors'
						>
							Découvrir <span className='text-base'>↓</span>
						</button>
					</motion.div>
				</div>

				{/* Scroll indicator */}
				<div className='absolute bottom-0 right-8 w-px h-8 bg-white/15' />
			</section>

			<div id='below-hero' />

			{/* Benefits Section */}
			<section className='py-24 bg-white relative'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='text-center mb-16'
					>
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
						className='grid grid-cols-1 md:grid-cols-3 gap-8'
					>
						{benefits.map((benefit, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
							>
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
						className='text-center mb-16'
					>
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
						className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
					>
						{animals.map((animal, index) => (
							<motion.div
								key={index}
								variants={itemVariants}
							>
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
							className='relative'
						>
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
							transition={{ duration: 0.7 }}
						>
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
								asChild
							>
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
					className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'
				>
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
						asChild
					>
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
