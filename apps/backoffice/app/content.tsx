'use client';

import type { BlogPost } from '@repo/app-types';
import { Briefcase, FileText, FolderTree, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type HomeContentProps = {
	stats: Record<string, number>;
	posts: BlogPost[];
};

export default function HomeContent({ stats, posts }: HomeContentProps) {
	const router = useRouter();

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
							{stats.posts}
						</div>
						<div className='text-sm text-gray-600'>Articles</div>
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
								<FolderTree className='w-6 h-6 text-white' />
							</div>
						</div>
						<div className='text-3xl font-bold text-gray-900 mb-1'>
							{stats.categories}
						</div>
						<div className='text-sm text-gray-600'>Catégories</div>
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
						<div className='text-sm text-gray-600'>Départments</div>
					</div>
				</motion.div>
			</div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className='bg-white rounded-2xl p-8 shadow-lg'
			>
				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
					Actions rapides
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<Link
						href='/blog'
						className='flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 group'
					>
						<div className='p-3 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 text-white'>
							<FileText className='w-5 h-5' />
						</div>
						<div className='text-left'>
							<div className='font-semibold text-gray-900 group-hover:text-purple-600 transition-colors'>
								Nouvel article
							</div>
							<div className='text-sm text-gray-600'>
								Créer un nouveau post de blog
							</div>
						</div>
					</Link>

					<Link
						href='/services'
						className='flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group'
					>
						<div className='p-3 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 text-white'>
							<Briefcase className='w-5 h-5' />
						</div>
						<div className='text-left'>
							<div className='font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
								Gérer les services
							</div>
							<div className='text-sm text-gray-600'>
								Modifier les tarifs et descriptions
							</div>
						</div>
					</Link>
				</div>
			</motion.div>

			{/* Recent Activity */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className='bg-white rounded-2xl p-8 shadow-lg'
			>
				<h2 className='text-2xl font-bold text-gray-900 mb-6'>
					Derniers articles
				</h2>
				<div className='space-y-4'>
					{posts.map((post) => (
						<div
							key={post.id}
							className='flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer'
							onClick={() => router.push('/blog')}
						>
							{/** biome-ignore lint/performance/noImgElement: TODO: FIX */}
							<img
								src={post.illustrationUrl}
								alt={post.title}
								className='w-16 h-16 rounded-lg object-cover'
							/>
							<div className='flex-1 min-w-0'>
								<h3 className='font-semibold text-gray-900 truncate'>
									{post.title}
								</h3>
								<p className='text-sm text-gray-600 truncate'>
									{post.excerpt}
								</p>
							</div>
							<div className='text-sm text-gray-500 whitespace-nowrap'>
								{new Date(post.createdAt).toLocaleDateString(
									'fr-FR',
									{
										day: '2-digit',
										month: 'short',
										year: 'numeric',
									}
								)}
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
}
