'use client';

import Form from '@/app/contact/components/Form';
import ContactInformations from '@/app/contact/components/Informations';
import ContactMap from '@/app/contact/components/Map';
import type { Department, Informations, Schedule } from '@repo/app-types';
import { ImageWithFallback } from '@repo/ui';
import { motion } from 'motion/react';

export default function ContactContent({
	informations,
	schedules,
	departments,
}: {
	informations: Informations;
	schedules: Schedule[];
	departments: Department[];
}) {
	return (
		<div className='min-h-screen'>
			{/* ── Hero ── */}
			<section className='-mt-18 relative min-h-[50svh] flex flex-col overflow-hidden'>
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
						Contact & Rendez-vous
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
						className='text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight'
					>
						Prenons
						<br />
						<span className='font-light text-white/50'>
							contact
						</span>
					</motion.h1>
				</div>

				<div className='absolute bottom-0 right-8 w-px h-8 bg-white/15' />
			</section>

			{/* ── Formulaire + Infos ── */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16'>
						<ContactInformations
							informations={informations}
							schedules={schedules}
						/>
						<Form />
					</div>
				</div>
			</section>

			{/* ── Carte ── */}
			<ContactMap
				departments={departments}
				actionLong={informations.actionLong ?? 0}
				actionLat={informations.actionLat ?? 0}
				actionRadius={informations.actionRadius ?? 0}
			/>
		</div>
	);
}
