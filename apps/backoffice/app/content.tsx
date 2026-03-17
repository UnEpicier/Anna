'use client';

import { Briefcase, FileText, MapPin, Radius } from 'lucide-react';
import { motion } from 'motion/react';

type HomeContentProps = {
	stats: {
		services: number;
		departments: number;
		actionRadius?: number;
		openDays?: number;
	};
};

export default function HomeContent({ stats }: HomeContentProps) {
	return (
		<div className='space-y-8'>
			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
				>
					<div className='absolute inset-0 bg-linear-to-br from-blue-500 to-cyan-500 opacity-5' />
					<div className='relative'>
						<div className='flex items-center justify-between mb-4'>
							<div className='p-3 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500'>
								<Briefcase className='w-6 h-6 text-white' />
							</div>
						</div>
						<div className='text-3xl font-bold text-gray-900 mb-1'>
							{stats.services}
						</div>
						<div className='text-sm text-gray-600'>Services</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className='relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
				>
					<div
						className={`absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 opacity-5`}
					/>
					<div className='relative'>
						<div className='flex items-center justify-between mb-4'>
							<div className='p-3 rounded-xl bg-linear-to-br from-purple-500 to-pink-500'>
								<FileText className='w-6 h-6 text-white' />
							</div>
						</div>
						<div className='text-3xl font-bold text-gray-900 mb-1'>
							{stats.openDays ?? 'Indisponible'}
						</div>
						<div className='text-sm text-gray-600'>
							Jours ouverts
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
				>
					<div className='absolute inset-0 bg-linear-to-br from-orange-500 to-red-500 opacity-5' />
					<div className='relative'>
						<div className='flex items-center justify-between mb-4'>
							<div className='p-3 rounded-xl bg-linear-to-br from-orange-500 to-red-500'>
								<Radius className='w-6 h-6 text-white' />
							</div>
						</div>
						<div className='text-3xl font-bold text-gray-900 mb-1'>
							{stats.actionRadius
								? `${stats.actionRadius} km`
								: 'Indisponible'}
						</div>
						<div className='text-sm text-gray-600'>
							Rayon d&apos;action
						</div>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300'
				>
					<div className='absolute inset-0 bg-linear-to-br from-green-500 to-emerald-500 opacity-5' />
					<div className='relative'>
						<div className='flex items-center justify-between mb-4'>
							<div className='p-3 rounded-xl bg-linear-to-br from-green-500 to-emerald-500'>
								<MapPin className='w-6 h-6 text-white' />
							</div>
						</div>
						<div className='text-3xl font-bold text-gray-900 mb-1'>
							{stats.departments}
						</div>
						<div className='text-sm text-gray-600'>
							Départements
						</div>
					</div>
				</motion.div>
			</div>

			<div className='flex justify-center items-center border-2 border-dashed border-gray-400 bg-gray-100 text-gray-500 rounded-2xl h-96'>
				{/* TODO: add stats (preference: chart otherwise numbers) from google analytics (visitors, page views, etc.) */}
				<p>Google Analytics stats (charts preferred)</p>
			</div>
		</div>
	);
}
