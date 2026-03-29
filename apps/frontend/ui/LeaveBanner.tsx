import type { Leave, ResponseObject } from '@repo/app-types';
import MarqueeText from './MarqueeText';

export default async function LeaveBanner() {
	const leaveRes = await fetch(`${process.env.API_URL}/leave`, {
		cache: 'no-cache',
	});

	if (!leaveRes.ok || !leaveRes.body) return;

	const leaveResponseData: ResponseObject<Leave | null> =
		await leaveRes.json();

	if (!leaveResponseData.success || !leaveResponseData.responseObject) return;

	const leave = {
		from: new Date(leaveResponseData.responseObject.from),
		to: new Date(leaveResponseData.responseObject.to),
	};

	const text = `Je serais absente du ${leave.from.toLocaleDateString(
		'fr-FR',
		{
			month: 'long',
			day: '2-digit',
			weekday: 'long',
		}
	)} au ${leave.to.toLocaleDateString('fr-FR', {
		month: 'long',
		day: '2-digit',
		weekday: 'long',
	})}`;

	return (
		<div
			role='status'
			aria-live='polite'
			aria-atomic
			className='w-full p-4 bg-linear-to-r from-primary to-primary/80 text-center text-white'
		>
			<MarqueeText>{text}</MarqueeText>
		</div>
	);
}
