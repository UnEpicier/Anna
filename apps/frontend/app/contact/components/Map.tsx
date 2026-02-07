import { motion } from 'motion/react';
import { Suspense } from 'react';
import MapLoader from '@/app/contact/components/Map/MapLoader';
import dynamic from 'next/dynamic';
import { Department } from '@/utils/types';
const Map = dynamic(() => import('@/app/contact/components/Map/Map'));

interface Props {
	departments: Department[];
	actionLong: number;
	actionLat: number;
	actionRadius: number;
}

export default function ContactMap({
	departments,
	actionLong,
	actionLat,
	actionRadius,
}: Props) {
	return (
		<section className='py-24 bg-linear-to-b from-white to-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='text-center mb-12'>
					<h2 className='text-4xl md:text-5xl text-primary mb-4'>
						Zone d&apos;Intervention
					</h2>
					<p className='text-gray-600 text-lg'>
						Découvrez les départements où j&apos;interviens
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='relative h-150 rounded-xl shadow-lg overflow-hidden'>
					<Suspense fallback={<MapLoader />}>
						<Map
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
