import type { Department } from '@repo/app-types';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import MapLoader from '@/app/contact/components/Map/MapLoader';

const MapComponent = dynamic(() => import('@/app/contact/components/Map/Map'));

interface Props {
	departments: Department[];
	actionLong: number;
	actionLat: number;
	actionRadius: number;
}

export default function ContactMap({ departments, actionLong, actionLat, actionRadius }: Props) {
	return (
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
							Déplacements
						</span>
					</div>
					<h2 className='text-4xl sm:text-5xl font-black text-white leading-none tracking-tight'>
						Zone<br />
						<span className='font-light text-white/45'>d&apos;intervention</span>
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.98 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='relative h-[500px] sm:h-[600px] overflow-hidden'
				>
					<Suspense fallback={<MapLoader />}>
						<MapComponent
							departments={departments}
							longitude={actionLong}
							latitude={actionLat}
							radius={actionRadius}
						/>
					</Suspense>
				</motion.div>
			</div>
		</section>
	);
}
