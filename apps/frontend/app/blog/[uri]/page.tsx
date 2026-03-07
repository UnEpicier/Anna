import type { BlogPost, ResponseObject } from '@repo/app-types';
import { Button, ImageWithFallback } from '@repo/ui';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getData(uri: string) {
	const res = await fetch(
		`${process.env.API_URL}/blog/posts/${uri}?include-categories=true`
	);

	const data: ResponseObject<BlogPost> = await res.json();

	if (res.status === 404) {
		notFound();
	}

	const post = data.responseObject;

	if (!post) {
		notFound();
	}

	return {
		...post,
		createdAt: new Date(post.createdAt),
		updatedAt: new Date(post.updatedAt),
	};
}

export default async function BlogPostPage(props: PageProps<'/blog/[uri]'>) {
	const { uri } = await props.params;

	const post = await getData(uri);

	return (
		<div className='min-h-screen bg-white'>
			{/* Header */}
			<div className='bg-linear-to-b from-secondary to-white pt-28'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<Button
						variant='ghost'
						className='mb-6 text-primary hover:text-primary/80'
						asChild
					>
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
				itemType='https://schema.org/BlogPosting'
			>
				<header>
					{post.categories && (
						<div className='mb-6'>
							<span className='bg-primary text-white px-3 py-1 rounded-full text-sm'>
								{post.categories.map((x) => x.name).join(', ')}
							</span>
						</div>
					)}

					<h1
						className='text-4xl text-primary mb-4'
						itemProp='headline'
					>
						{post.title}
					</h1>

					<div className='flex items-center space-x-2 text-gray-500 mb-8'>
						<Calendar className='h-4 w-4' />
						<time
							dateTime={post.createdAt.toISOString()}
							itemProp='datePublished'
						>
							{post.createdAt.toLocaleDateString('fr-FR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</time>

						{post.updatedAt !== post.createdAt && (
							<time
								dateTime={post.updatedAt.toISOString()}
								itemProp='dateModified'
								className='sr-only'
							>
								Mis à jour le{' '}
								{post.updatedAt.toLocaleDateString('fr-FR', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
						)}

						<address
							className='sr-only'
							itemProp='author'
							itemScope
							itemType='https://schema.org/Person'
						>
							Par <span itemProp='name'>Anna Nischwitz</span>
						</address>
					</div>

					<div className='relative h-96 mb-8 rounded-lg overflow-hidden'>
						<ImageWithFallback
							src={post.illustrationUrl}
							alt={post.title}
							className='w-full h-full object-cover'
						/>
					</div>
				</header>

				<div
					className='prose prose-lg max-w-none'
					itemProp='articleBody'
				>
					{post.content.length === 0 ? (
						<p className='text-gray-600'>{post.excerpt}</p>
					) : (
						post.content.map((block, index) => {
							if (block.type === 'paragraph') {
								return (
									<p
										key={index}
										className='mb-6 text-gray-700 leading-relaxed'
									>
										{block.text}
									</p>
								);
							}
							if (block.type === 'heading') {
								return (
									<h2
										key={index}
										className='text-2xl text-primary mt-8 mb-4'
									>
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
						Besoin d&apos;un Rendez-vous ?
					</h3>
					<p className='text-gray-600 mb-6'>
						N&apos;hésitez pas à me contacter pour discuter des
						besoins de votre animal.
					</p>
					<Button
						className='bg-primary hover:bg-primary/90'
						asChild
					>
						<Link href='/contact'>Prendre Rendez-vous</Link>
					</Button>
				</div>
			</article>
		</div>
	);
}
