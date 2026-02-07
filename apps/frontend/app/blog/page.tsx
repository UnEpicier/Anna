'use client';
import { useMemo, useState } from 'react';
import { Badge, Card, CardContent, CardHeader, ImageWithFallback } from '@repo/ui';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { siteData } from '@/mock/defaultData';
import { useRouter } from 'next/navigation';

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

export default function BlogPage() {
	const router = useRouter();

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null,
	);

	const filteredPosts = useMemo(() => {
		if (selectedCategory) {
			return siteData.blogPosts.filter(
				(post) => post.category === selectedCategory,
			);
		}

		return siteData.blogPosts;
	}, [selectedCategory]);

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
					className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h1 className='text-5xl md:text-6xl text-primary mb-6'>
						Blog
					</h1>
					<p className='text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
						Conseils, actualités et informations sur l'ostéopathie
						animalière pour prendre soin de vos compagnons.
					</p>
				</motion.div>
			</section>

			{/* Category Filter */}
			<section className='py-12 bg-white/80 backdrop-blur-sm sticky top-20 z-40 border-b border-border shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-wrap gap-3 justify-center'>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}>
							<Badge
								onClick={() => setSelectedCategory(null)}
								className={`cursor-pointer px-6 py-2.5 rounded-full transition-all shadow-sm ${
									selectedCategory === null
										? 'bg-primary text-white shadow-lg scale-105'
										: 'bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40'
								}`}>
								Tous
							</Badge>
						</motion.div>
						{siteData.categories.map((category) => (
							<motion.div
								key={category}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								<Badge
									onClick={() =>
										setSelectedCategory(category)
									}
									className={`cursor-pointer px-6 py-2.5 rounded-full transition-all shadow-sm ${
										selectedCategory === category
											? 'bg-primary text-white shadow-lg scale-105'
											: 'bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40'
									}`}>
									{category}
								</Badge>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Blog Posts Grid */}
			<section className='py-16 bg-linear-to-b from-white to-gray-50'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{filteredPosts.length === 0 ? (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className='text-center text-gray-500 py-20'>
							<p className='text-lg'>
								Aucun article dans cette catégorie.
							</p>
						</motion.div>
					) : (
						<motion.div
							variants={containerVariants}
							initial='hidden'
							animate='visible'
							className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
							{filteredPosts.map((post) => (
								<motion.article
									key={post.id}
									variants={itemVariants}
									itemScope
									itemType='https://schema.org/BlogPosting'>
									<Card
										className='overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full bg-white'
										onClick={() =>
											router.push(`/blog/${post.id}`)
										}>
										<div className='relative h-56 overflow-hidden'>
											<ImageWithFallback
												src={post.image}
												alt={post.title}
												className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
											/>
											<div className='absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
											<div className='absolute top-4 left-4'>
												<span className='bg-primary text-white px-4 py-1.5 rounded-full text-sm shadow-lg'>
													{post.category}
												</span>
											</div>
										</div>
										<CardHeader>
											<div className='flex items-center gap-2 text-sm text-gray-500 mb-3'>
												<div className='bg-primary/10 p-1.5 rounded-lg'>
													<Calendar className='h-3.5 w-3.5 text-primary' />
												</div>
												<time
													dateTime={post.date}
													itemProp='datePublished'>
													{post.date}
												</time>
											</div>
											<h2
												className='text-xl text-primary group-hover:text-primary/80 transition-colors line-clamp-2 leading-none'
												itemProp='headline'>
												{post.title}
											</h2>
										</CardHeader>
										<CardContent>
											<p
												itemProp='description'
												className='text-gray-600 mb-6 line-clamp-3 leading-relaxed'>
												{post.excerpt}
											</p>
											<div
												className='flex items-center text-primary group-hover:text-primary/80 transition-colors'
												aria-label={`Lire l'article complet : ${post.title}`}>
												<span className='mr-2'>
													Lire la suite
												</span>
												<ArrowRight className='h-4 w-4 group-hover:translate-x-2 transition-transform duration-300' />
											</div>
										</CardContent>
									</Card>
								</motion.article>
							))}
						</motion.div>
					)}
				</div>
			</section>

			{/* Newsletter CTA */}
			<section className='py-24 bg-linear-to-br from-secondary to-white relative overflow-hidden'>
				<div className='absolute inset-0 opacity-20'>
					<div className='absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl'></div>
					<div className='absolute bottom-10 right-10 w-80 h-80 bg-primary rounded-full blur-3xl'></div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className='relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-4xl md:text-5xl text-primary mb-6'>
						Restez Informé
					</h2>
					<p className='text-gray-600 text-lg leading-relaxed'>
						Recevez mes derniers articles et conseils directement
						dans votre boîte mail (à venir).
					</p>
				</motion.div>
			</section>
		</div>
	);
}
