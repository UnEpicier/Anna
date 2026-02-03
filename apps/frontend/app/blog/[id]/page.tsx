import { siteData } from '@/mock/defaultData';
import Button from '@/components/Button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BlogPostPage(props: PageProps<'/blog/[id]'>) {
	const { id } = await props.params;

	const post = siteData.blogPosts.find((p) => p.id === id);

	if (!post) {
		notFound();
	}

	return (
		<div className='min-h-screen bg-white'>
			{/* Header */}
			<div className='bg-linear-to-b from-secondary to-white pt-28'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<Button
						variant='ghost'
						className='mb-6 text-primary hover:text-primary/80'
						asChild>
						<Link href='/blog'>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Retour au Blog
						</Link>
					</Button>
				</div>
			</div>

			{/* Article */}
			<article
				className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8'
				itemScope
				itemType='https://schema.org/BlogPosting'>
				<header>
					<div className='mb-6'>
						<span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
							{post.category}
						</span>
					</div>

					<h1
						className='text-4xl text-primary mb-4'
						itemProp='headline'>
						{post.title}
					</h1>

					<div className='flex items-center space-x-2 text-gray-500 mb-8'>
						<Calendar className='h-4 w-4' />
						<time
							dateTime={post.date}
							itemProp='datePublished'>
							{post.date}
						</time>

						{/*Si l'article a été modifié*/}
						{/*<time datetime="2024-12-05T14:30:00+01:00" itemprop="dateModified" class="sr-only">
						Mis à jour le 5 décembre 2024
					</time>*/}

						<address
							className='sr-only'
							itemProp='author'
							itemScope
							itemType='https://schema.org/Person'>
							Par <span itemProp='name'>Anna Nischwitz</span>
						</address>
					</div>

					{post.image && (
						<div className='relative h-96 mb-8 rounded-lg overflow-hidden'>
							<ImageWithFallback
								src={post.image}
								alt={post.title}
								className='w-full h-full object-cover'
							/>
						</div>
					)}
				</header>

				<div
					className='prose prose-lg max-w-none'
					itemProp='articleBody'>
					{post.content.length === 0 ? (
						<p className='text-gray-600'>{post.excerpt}</p>
					) : (
						post.content.map((block, index) => {
							if (block.type === 'paragraph') {
								return (
									<p
										key={index}
										className='mb-6 text-gray-700 leading-relaxed'>
										{block.text}
									</p>
								);
							}
							if (block.type === 'heading') {
								return (
									<h2
										key={index}
										className='text-2xl text-primary mt-8 mb-4'>
										{block.text}
									</h2>
								);
							}
							return null;
						})
					)}
				</div>

				{/* CTA */}
				<div className='mt-12 p-8 bg-secondary rounded-lg text-center'>
					<h3 className='text-2xl text-primary mb-4'>
						Besoin d'un Rendez-vous ?
					</h3>
					<p className='text-gray-600 mb-6'>
						N'hésitez pas à me contacter pour discuter des besoins
						de votre animal.
					</p>
					<Button
						className='bg-primary hover:bg-primary/90'
						asChild>
						<Link href='/contact'>Prendre Rendez-vous</Link>
					</Button>
				</div>
			</article>
		</div>
	);
}
