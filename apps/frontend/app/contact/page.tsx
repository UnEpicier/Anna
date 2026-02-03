import ContactContent from '@/app/contact/content';
import { Response, Informations, Department, Schedule } from '@/utils/types';

async function getData() {
	const result: {
		departments: Department[];
		informations: Informations | null;
		schedules: Schedule[];
	} = {
		departments: [],
		informations: null,
		schedules: [],
	};

	// --- Departments

	const departmentsRes = await fetch(
		`${process.env.API_URL}/departments/actives`,
		{
			next: { revalidate: 60 },
		},
	);
	const departmentsResponseData: Response<Department[]> =
		await departmentsRes.json();

	if (departmentsResponseData.success) {
		result.departments = departmentsResponseData.responseObject.filter(
			(x) => x.active,
		);
	}

	// --- Informations

	const infoRes = await fetch(`${process.env.API_URL}/informations`, {
		next: { revalidate: 60 },
	});
	const infoResponseData: Response<Informations> = await infoRes.json();

	if (infoResponseData.success) {
		result.informations = infoResponseData.responseObject;
	}

	// --- Schedules

	const schedulesRes = await fetch(`${process.env.API_URL}/schedules`, {
		//next: { revalidate: 60 },
		cache: 'no-cache',
	});
	const schedulesResponseData: Response<Schedule[]> =
		await schedulesRes.json();

	if (schedulesResponseData.success) {
		// Sort schedules by day of the week
		const sortedDays = schedulesResponseData.responseObject.toSorted(
			(a, b) => {
				const daysOfWeek = [
					'monday',
					'tuesday',
					'wednesday',
					'thursday',
					'friday',
					'saturday',
					'sunday',
				];
				return (
					daysOfWeek.indexOf(a.day.toLowerCase()) -
					daysOfWeek.indexOf(b.day.toLowerCase())
				);
			},
		);

		result.schedules = sortedDays;
	}

	return result;
}

export default async function ContactPage() {
	const data = await getData();

	if (!data.informations) {
		throw new Error('Informations not found');
	}

	return (
		<ContactContent
			informations={data.informations}
			schedules={data.schedules}
			departments={data.departments}
		/>
	);
}
