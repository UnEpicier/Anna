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
		result.categories = categoriesResponseData.responseObject;
	}

	// --- Posts

	const postsRes = await fetch(`${process.env.API_URL}/blog/posts`, {
		next: { revalidate: 60 },
	});
	const postsResponseData = await postsRes.json();

	if (postsResponseData.success) {
		result.posts = postsResponseData.responseObject;
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
