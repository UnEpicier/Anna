import HomeContent from '@/app/(app)/content';
import type {
	Informations,
	ResponseObject,
	Schedule,
	Service,
} from '@repo/app-types';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getData() {
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;
	const authHeaders: Record<string, string> = token
		? { Cookie: `token=${token}` }
		: {};

	const [servicesRes, departmentsRes, informationsRes, schedulesRes] =
		await Promise.all([
			fetch(`${process.env.API_URL}/services`, { headers: authHeaders }),
			fetch(`${process.env.API_URL}/departments/actives`, {
				headers: authHeaders,
			}),
			fetch(`${process.env.API_URL}/informations`, {
				headers: authHeaders,
			}),
			fetch(`${process.env.API_URL}/schedules`, { headers: authHeaders }),
		]);

	const [services, departments, informations, schedules] = await Promise.all([
		servicesRes.json() as Promise<ResponseObject<Service[]>>,
		departmentsRes.json() as Promise<
			ResponseObject<{ id: string; name: string }[]>
		>,
		informationsRes.json() as Promise<ResponseObject<Informations>>,
		schedulesRes.json() as Promise<ResponseObject<Schedule[]>>,
	]);

	return {
		services: services.success ? services.responseObject.length : 0,
		departments: departments.success
			? departments.responseObject.length
			: 0,
		actionRadius: informations.responseObject?.actionRadius ?? undefined,
		openDays: schedules.success
			? schedules.responseObject.filter((x) => x.open).length
			: undefined,
	};
}

export default async function Home() {
	const data = await getData();

	return <HomeContent stats={data} />;
}
