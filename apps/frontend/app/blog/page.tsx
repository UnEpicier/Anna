import BlogContent from '@/app/blog/content';
import type { ResponseObject, BlogCategory, BlogPost } from '@repo/app-types';

async function getData() {
	const result: {
		categories: BlogCategory[];
		posts: BlogPost[];
	} = {
		categories: [],
		posts: [],
	};

	// --- Categories

	const categoriesRes = await fetch(
		`${process.env.API_URL}/blog/categories`,
		{
			next: { revalidate: 60 },
		},
	);
	const categoriesResponseData: ResponseObject<BlogCategory[]> =
		await categoriesRes.json();

	if (categoriesResponseData.success) {
		result.categories = categoriesResponseData.responseObject.map(
			(category) => ({
				...category,
				createdAt: new Date(category.createdAt),
				updatedAt: new Date(category.updatedAt),
			}),
		);
	}

	// --- Posts

	const postsRes = await fetch(
		`${process.env.API_URL}/blog/posts?includeCategories=true`,
		{
			next: { revalidate: 60 },
		},
	);
	const postsResponseData: ResponseObject<BlogPost[]> = await postsRes.json();

	if (postsResponseData.success) {
		result.posts = postsResponseData.responseObject.map((post) => ({
			...post,
			createdAt: new Date(post.createdAt),
			updatedAt: new Date(post.updatedAt),
		}));
	}

	return result;
}

export default async function BlogPage() {
	const { categories, posts } = await getData();

	// Return empty page if any categories AND any posts

	return (
		<BlogContent
			categories={categories}
			posts={posts}
		/>
	);
}
