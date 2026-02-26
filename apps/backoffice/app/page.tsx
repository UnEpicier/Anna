import HomeContent from '@/app/content';
import {
	BlogCategory,
	BlogPost,
	ResponseObject,
	Service,
} from '@repo/app-types';

async function getData() {
	const servicesRes = await fetch(`${process.env.API_URL}/services`);
	const services: ResponseObject<Service[]> = await servicesRes.json();

	const categoriesRes = await fetch(`${process.env.API_URL}/blog/categories`);
	const categories: ResponseObject<BlogCategory[]> =
		await categoriesRes.json();

	const postsRes = await fetch(`${process.env.API_URL}/blog/posts`);
	const posts: ResponseObject<BlogPost[]> = await postsRes.json();

	const departmentsRes = await fetch(
		`${process.env.API_URL}/departments/actives`,
	);
	const departments: ResponseObject<{ id: string; name: string }[]> =
		await departmentsRes.json();

	return {
		stats: {
			services: services.success ? services.responseObject.length : 0,
			categories: categories.success
				? categories.responseObject.length
				: 0,
			posts: posts.success ? posts.responseObject.length : 0,
			departments: departments.success
				? departments.responseObject.length
				: 0,
		},
		posts: posts.success ? posts.responseObject.slice(0, 5) : [],
	};
}

export default async function Home() {
	const data = await getData();

	return (
		<HomeContent
			stats={data.stats}
			posts={data.posts}
		/>
	);
}
