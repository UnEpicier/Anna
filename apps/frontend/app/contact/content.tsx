'use client';

import type { Department, Informations, Schedule } from '@repo/app-types';
import { motion } from 'motion/react';
import Form from '@/app/contact/components/Form';
import ContactInformations from '@/app/contact/components/Informations';
import ContactMap from '@/app/contact/components/Map';

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
		<div className='min-h-screen pt-20'>
			{/* Header */}
			<section className='relative py-24 overflow-hidden'>
				<div className='absolute inset-0 bg-linear-to-br from-secondary via-white to-primary/5'></div>
				<div className='absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl'></div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'
				>
					<h1 className='text-5xl md:text-6xl text-primary mb-6'>
						Contact
					</h1>
					<p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
						Une question ? Besoin de prendre rendez-vous ?
						N&apos;hésitez pas à me contacter.
					</p>
				</motion.div>
			</section>

			{/* Contact Section */}
			<section className='py-16 bg-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
						<ContactInformations
							informations={informations}
							schedules={schedules}
						/>

						<Form />
					</div>
				</div>
			</section>

			{/* Map Section */}
			<ContactMap
				departments={departments}
				actionLong={informations.actionLong ?? 0}
				actionLat={informations.actionLat ?? 0}
				actionRadius={informations.actionRadius ?? 0}
			/>
		</div>
	);
}
