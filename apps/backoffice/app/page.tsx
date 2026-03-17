import HomeContent from '@/app/content';
import type {
	Informations,
	ResponseObject,
	Schedule,
	Service,
} from '@repo/app-types';

async function getData() {
	const servicesRes = await fetch(`${process.env.API_URL}/services`);
	const services: ResponseObject<Service[]> = await servicesRes.json();

	const departmentsRes = await fetch(
		`${process.env.API_URL}/departments/actives`
	);
	const departments: ResponseObject<{ id: string; name: string }[]> =
		await departmentsRes.json();

	const informationsRes = await fetch(`${process.env.API_URL}/informations`);
	const informations: ResponseObject<Informations> =
		await informationsRes.json();

	const schedulesRes = await fetch(`${process.env.API_URL}/schedules`);
	const schedules: ResponseObject<Schedule[]> = await schedulesRes.json();

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
