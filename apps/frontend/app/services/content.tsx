'use client';

import type { Informations, Service } from '@repo/app-types';
import { ImageWithFallback } from '@repo/ui';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

const indications = [
	'Boiteries et troubles locomoteurs',
	'Raideurs et perte de mobilité',
	'Troubles comportementaux',
	'Post-opératoire et rééducation',
	'Préparation et récupération sportive',
	'Suivi des animaux âgés',
	'Prévention et bien-être général',
];

const infos = [
	{
		label: "Zone d'intervention",
		getValue: (info: Informations) =>
			`À domicile dans un rayon de ${info.actionRadius} km autour de ${info.actionAddress}. Au-delà : 0,50 €/km supplémentaire.`,
	},
	{ label: 'Paiement', getValue: () => 'Espèces, chèque, carte bancaire.' },
	{ label: 'Annulation', getValue: () => "48h à l'avance sans frais." },
	{
		label: 'Suivi',
		getValue: () => 'Compte-rendu écrit après chaque séance.',
	},
];

const stagger = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ContentService({
	services,
	informations,
}: {
	services: Service[];
	informations: Informations;
}) {
	return (
		<div className='min-h-screen'>
			{/* ── Hero ── */}
			<section className='-mt-18 relative min-h-[60svh] sm:min-h-[70svh] flex flex-col overflow-hidden'>
				<div className='absolute inset-0'>
					<ImageWithFallback
						src='https://images.unsplash.com/photo-1450778869180-41d0601e046e'
						alt=''
						className='w-full h-full object-cover brightness-75'
					/>
					<div className='absolute inset-0 bg-linear-to-t from-[rgba(8,5,3,0.92)] via-[rgba(8,5,3,0.45)] to-transparent' />
				</div>

				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='relative z-10 flex justify-center pt-28'
				>
					<span className='px-4 py-2 text-[10px] tracking-[2px] uppercase text-white font-medium border border-white/30 rounded-full backdrop-blur-sm bg-white/10'>
						Services & Tarifs · Bordeaux
					</span>
				</motion.div>

				<div className='flex-1' />

				<div className='relative z-10 px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className='flex items-center gap-3 mb-4'
					>
						<span className='w-6 h-px bg-primary/70' />
						<span className='text-[10px] tracking-[2px] uppercase text-primary/90'>
							Ostéopathie Animalière
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className='text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-4'
					>
						Services
						<br />
						<span className='font-light text-white/50'>
							&amp; tarifs
						</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.65 }}
						className='text-sm text-white/55 leading-relaxed max-w-sm'
					>
						Soins à domicile adaptés à chaque animal. Déplacement
						inclus dans un rayon de {informations.actionRadius} km.
					</motion.p>
				</div>

				<div className='absolute bottom-0 right-8 w-px h-8 bg-white/15' />
			</section>

			{/* ── Services ── */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='flex items-center gap-3 mb-10'
					>
						<span className='w-5 h-px bg-primary' />
						<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
							Nos prestations
						</span>
					</motion.div>

					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={stagger}
						className='divide-y divide-border'
					>
						{services.map((service, i) => (
							<motion.div
								key={service.id}
								variants={fadeUp}
								className='grid grid-cols-[36px_1fr_auto] sm:grid-cols-[44px_1fr_auto] gap-4 sm:gap-6 py-6 sm:py-7 group items-start'
							>
								<span className='text-[10px] font-black text-primary pt-1'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<div>
									<h2 className='text-base sm:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors'>
										{service.title}
									</h2>
									<p className='text-sm text-muted-foreground leading-relaxed max-w-xl'>
										{service.description}
									</p>
									<span className='mt-2 inline-block text-[9px] tracking-[2px] uppercase text-muted-foreground/60'>
										⏱ {service.duration}
									</span>
								</div>
								<div className='text-right pt-1'>
									<div className='text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none'>
										{service.price}€
									</div>
									<div className='text-[8px] tracking-[1.5px] uppercase text-muted-foreground mt-1'>
										par séance
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ── Pratique (dark, fusionnée) ── */}
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
							<span className='w-5 h-px bg-primary/70' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
								Informations pratiques
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl font-black text-white leading-none tracking-tight'>
							Tout ce qu&apos;il
							<br />
							<span className='font-light text-white/45'>
								faut savoir
							</span>
						</h2>
					</motion.div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20'>
						{/* Quand consulter */}
						<motion.div
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}
							variants={stagger}
						>
							<h3 className='text-[11px] tracking-[2px] uppercase text-white/50 font-semibold mb-6'>
								Quand consulter ?
							</h3>
							{indications.map((item) => (
								<motion.div
									key={item}
									variants={fadeUp}
									className='flex items-start gap-4 py-3 border-b border-white/5 last:border-0'
								>
									<span className='w-1 h-1 rounded-full bg-primary mt-2 shrink-0' />
									<span className='text-sm text-white/60 leading-relaxed'>
										{item}
									</span>
								</motion.div>
							))}
						</motion.div>

						{/* Infos pratiques */}
						<motion.div
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}
							variants={stagger}
						>
							<h3 className='text-[11px] tracking-[2px] uppercase text-white/50 font-semibold mb-6'>
								Infos pratiques
							</h3>
							<div className='space-y-3'>
								{infos.map((info) => (
									<motion.div
										key={info.label}
										variants={fadeUp}
										className='p-4 border border-white/6 bg-white/2'
									>
										<div className='text-[9px] tracking-[2px] uppercase text-primary font-semibold mb-2'>
											{info.label}
										</div>
										<p className='text-sm text-white/55 leading-relaxed'>
											{info.getValue(informations)}
										</p>
									</motion.div>
								))}
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className='py-16 sm:py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='relative bg-[#111] rounded-2xl sm:rounded-3xl px-8 sm:px-16 py-14 sm:py-20 text-center overflow-hidden'
					>
						<div className='absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none' />

						<p className='text-[9px] tracking-[2px] uppercase text-primary/70 mb-4'>
							Prêt à commencer ?
						</p>
						<h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-4'>
							Prenons
							<br />
							<span className='font-light text-white/50'>
								rendez-vous
							</span>
						</h2>
						<p className='text-sm text-white/40 mb-8 max-w-md mx-auto leading-relaxed'>
							Consultation personnalisée à domicile.
							N&apos;hésitez pas à me contacter pour toute
							question sur les tarifs.
						</p>
						<Link
							href='/contact'
							className='inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold tracking-[2px] uppercase px-8 py-4 transition-colors'
						>
							Me contacter
							<ArrowRight className='h-4 w-4' />
						</Link>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
