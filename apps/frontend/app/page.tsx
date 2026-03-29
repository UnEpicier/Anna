'use client';

import { Button, ImageWithFallback } from '@repo/ui';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

// Content
const benefits = [
	{
		title: 'Approche Douce',
		description:
			'Une méthode naturelle et non invasive pour le bien-être de vos animaux',
	},
	{
		title: 'Disponibilité',
		description: 'Déplacements à domicile pour le confort de votre animal',
	},
	{
		title: 'Expertise',
		description:
			'Diplômée et formée aux techniques ostéopathiques pour tous animaux',
	},
];

const animals = [
	{
		emoji: '🐕',
		name: 'Chiens',
		description: 'Prise en charge adaptée à toutes les races et tous les âges',
	},
	{
		emoji: '🐈',
		name: 'Chats',
		description: 'Soins en douceur dans un environnement familier',
	},
	{
		emoji: '🐰',
		name: 'NAC',
		description: 'Expertise pour lapins, furets et autres petits animaux',
	},
	{
		emoji: '🐴',
		name: 'Chevaux',
		description: 'Ostéopathie équine pour améliorer les performances',
	},
];

const stats = [
	{ num: '4', label: 'Espèces' },
	{ num: '100%', label: 'Naturel' },
	{ num: 'Bordeaux', label: '& région' },
	{ num: 'Domicile', label: 'À domicile' },
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
						alt=''
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
							Ostéopathe Animalière Diplômée
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className='text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-4'
					>
						Anna<br />
						<span className='font-light text-white/60'>Nischwitz</span>
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
							aria-label='Découvrir le contenu'
							onClick={() => document.getElementById('below-hero')?.scrollIntoView({ behavior: 'smooth' })}
							className='text-sm text-white/40 flex items-center gap-1 hover:text-white/60 transition-colors'
						>
							Découvrir <span aria-hidden='true' className='text-base'>↓</span>
						</button>
					</motion.div>
				</div>

				{/* Scroll indicator */}
				<div className='absolute bottom-0 right-8 w-px h-8 bg-white/15' />
			</section>

			{/* Stats Bar */}
			<div id='below-hero' className='grid grid-cols-2 sm:grid-cols-4 bg-white border-b border-border'>
				{stats.map((stat, i) => (
					<motion.div
						key={stat.num}
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: i * 0.07 }}
						className='flex flex-col items-center justify-center py-5 px-4 text-center border-b sm:border-b-0 nth-3:border-b-0 nth-4:border-b-0 border-r even:border-r-0 sm:even:border-r sm:last:border-r-0 border-border'
					>
						<span className='text-xl font-black text-foreground tracking-tight'>{stat.num}</span>
						<span className='text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5'>{stat.label}</span>
					</motion.div>
				))}
			</div>

			{/* Benefits */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='w-5 h-px bg-primary' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
								Pourquoi l&apos;ostéopathie
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-none tracking-tight mb-10'>
							Une approche<br />
							<span className='text-primary font-light'>naturelle</span><br />
							&amp; douce
						</h2>
					</motion.div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start'>
						{/* Liste numérotée */}
						<motion.div
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}
							variants={containerVariants}
							className='divide-y divide-secondary'
						>
							{benefits.map((benefit, i) => (
								<motion.div
									key={benefit.title}
									variants={itemVariants}
									className='flex gap-4 py-5 group'
								>
									<span className='text-[11px] font-black text-primary min-w-6 pt-0.5'>
										{String(i + 1).padStart(2, '0')}
									</span>
									<div>
										<h3 className='text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors'>{benefit.title}</h3>
										<p className='text-sm text-muted-foreground leading-relaxed'>{benefit.description}</p>
									</div>
								</motion.div>
							))}
						</motion.div>

						{/* Photo portrait */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.2 }}
							className='rounded-2xl overflow-hidden aspect-3/4 w-full max-w-xs mx-auto lg:mx-0 lg:max-w-none'
						>
							<ImageWithFallback
								src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
								alt='Anna Nischwitz'
								className='w-full h-full object-cover'
							/>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Animals */}
			<section className='py-20 sm:py-28 bg-[#111]'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='mb-10'
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='w-5 h-px bg-[#c4956a]/70' />
							<span className='text-[9px] tracking-[2px] uppercase text-[#c4956a]/80 font-semibold'>
								Tous les bienvenus
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight'>
							Vos <span className='font-light text-[#c4956a]/90'>compagnons</span>,<br />
							mon expertise
						</h2>
					</motion.div>

					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={containerVariants}
						className='grid grid-cols-2 lg:grid-cols-4 border border-white/5 rounded-2xl overflow-hidden'
					>
						{animals.map((animal) => (
							<motion.div
								key={animal.name}
								variants={itemVariants}
								className='p-6 sm:p-8 bg-[#111] hover:bg-[#161616] transition-colors border-r border-b border-white/5 last:border-r-0 nth-2:border-r-0 lg:nth-2:border-r nth-3:border-r-0 lg:nth-3:border-r lg:nth-1:border-b-0 lg:nth-2:border-b-0 nth-3:border-b-0 nth-4:border-b-0 lg:nth-4:border-r-0'
							>
								<div className='text-3xl mb-4'>{animal.emoji}</div>
								<h3 className='text-lg font-black text-white mb-2'>{animal.name}</h3>
								<p className='text-xs text-white/40 leading-relaxed'>{animal.description}</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* About */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-end'>
						{/* Photo */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}
							className='rounded-2xl overflow-hidden aspect-2/3 w-full max-w-xs mx-auto lg:mx-0 lg:max-w-none'
						>
							<ImageWithFallback
								src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
								alt='Anna Nischwitz'
								className='w-full h-full object-cover'
							/>
						</motion.div>

						{/* Texte */}
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.15 }}
						>
							<div className='flex items-center gap-3 mb-4'>
								<span className='w-5 h-px bg-primary' />
								<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
									À propos
								</span>
							</div>
							<h2 className='text-4xl sm:text-5xl font-black text-foreground leading-none tracking-tight mb-6'>
								<span className='text-primary font-light'>Passionnée</span><br />
								par le bien-être<br />
								animal
							</h2>
							<div className='space-y-4 text-sm text-muted-foreground leading-relaxed'>
								<p>
									Diplômée en ostéopathie animalière, je me consacre depuis plusieurs
									années au bien-être de nos compagnons à quatre pattes et de nos amis équidés.
								</p>
								<p>
									Ma passion pour les animaux et mon expertise me permettent d&apos;identifier
									et de traiter les tensions, blocages et déséquilibres qui peuvent affecter
									la qualité de vie de vos animaux.
								</p>
								<p>
									Chaque séance est personnalisée en fonction des besoins spécifiques de
									l&apos;animal, dans le respect de son bien-être et de sa physiologie.
								</p>
							</div>
							<Button
								className='mt-8 bg-primary hover:bg-primary/90 font-bold shadow-lg group'
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

			{/* CTA */}
			<section className='py-16 sm:py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='relative bg-[#111] rounded-2xl sm:rounded-3xl px-8 sm:px-16 py-14 sm:py-20 text-center overflow-hidden'
					>
						{/* Lueur radiale */}
						<div className='absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none' />

						<p className='text-[9px] tracking-[2px] uppercase text-[#c4956a]/70 mb-4'>
							Prêt à commencer ?
						</p>
						<h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-4'>
							Améliorons le bien-être<br />
							<span className='font-light text-white/50'>de votre animal</span>
						</h2>
						<p className='text-sm text-white/40 mb-8 max-w-md mx-auto leading-relaxed'>
							Prenez rendez-vous dès aujourd&apos;hui pour une consultation personnalisée à domicile.
						</p>
						<Button
							size='lg'
							className='bg-primary hover:bg-primary/90 text-white font-bold shadow-2xl hover:shadow-xl transition-all hover:scale-105'
							asChild
						>
							<Link href='/contact'>
								Prendre Rendez-vous
								<ArrowRight className='ml-2 h-5 w-5' />
							</Link>
						</Button>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
