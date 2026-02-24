import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';
import { capitalize, formatPhoneNumber, formatTime } from '@/utils/format';
import { AlertCircle, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Informations, Schedule } from '@repo/app-types';

interface Props {
	informations: Informations;
	schedules: Schedule[];
}

export default function ContactInformations({
	informations,
	schedules,
}: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className='space-y-6'>
			<Card className='border-0 shadow-lg bg-linear-to-br from-white to-gray-50/50'>
				<CardHeader>
					<CardTitle className='text-primary text-2xl'>
						Informations de Contact
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6'>
					<a
						href={`tel:${formatPhoneNumber(informations.phone)}`}
						className='flex items-start gap-4 group'>
						<div className='bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors'>
							<Phone className='h-5 w-5 text-primary' />
						</div>
						<div>
							<p className='text-gray-900 mb-1'>Téléphone</p>
							<p className='text-gray-600 group-hover:text-primary transition-colors'>
								{formatPhoneNumber(informations.phone)}
							</p>
						</div>
					</a>

					<a
						href={`mailto:${informations.email}`}
						className='flex items-start gap-4 group'>
						<div className='bg-primary/10 p-3 rounded-xl group-hover:bg-primary/20 transition-colors'>
							<Mail className='h-5 w-5 text-primary' />
						</div>
						<div>
							<p className='text-gray-900 mb-1'>Email</p>
							<p className='text-gray-600 group-hover:text-primary transition-colors break-all'>
								{informations.email}
							</p>
						</div>
					</a>

					<div className='flex items-start gap-4'>
						<div className='bg-primary/10 p-3 rounded-xl'>
							<MapPin className='h-5 w-5 text-primary' />
						</div>
						<div>
							<p className='text-gray-900 mb-1'>
								Zone d&apos;intervention
							</p>
							<p className='text-gray-600'>
								{informations.actionRadius}km autour de{' '}
								{informations.actionAddress}
							</p>
						</div>
					</div>

					<div className='flex items-start gap-4'>
						<div className='bg-primary/10 p-3 rounded-xl'>
							<Clock className='h-5 w-5 text-primary' />
						</div>
						<div>
							<p className='text-gray-900 mb-1'>Disponibilités</p>
							<SchedulesList schedules={schedules} />
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className='border-0 shadow-md bg-linear-to-br from-amber-50 to-white'>
				<CardContent className='pt-6 pb-6'>
					<div className='flex items-start gap-3'>
						<div className='bg-amber-500/10 p-2 rounded-xl'>
							<AlertCircle className='h-5 w-5 text-amber-600' />
						</div>
						<div>
							<h3 className='text-lg text-amber-900 mb-2'>
								Urgences
							</h3>
							<p className='text-amber-800/80 text-sm leading-relaxed'>
								En cas d&apos;urgence vétérinaire, veuillez
								contacter directement votre vétérinaire ou les
								urgences vétérinaires les plus proches.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

const days: Record<string, string> = {
	monday: 'lundi',
	tuesday: 'mardi',
	wednesday: 'mercredi',
	thursday: 'jeudi',
	friday: 'vendredi',
	saturday: 'samedi',
	sunday: 'dimanche',
};

function SchedulesList({ schedules }: { schedules: Schedule[] }) {
	if (schedules.length === 0) {
		return <p className='text-gray-600'>Aucun horaire disponible.</p>;
	}

	let sameHoursDays = 1;
	for (let i = 1; i < schedules.length; i++) {
		if (
			formatTime(schedules[i]!.startTime) ===
				formatTime(schedules[0]!.startTime) &&
			formatTime(schedules[i]!.endTime) ===
				formatTime(schedules[0]!.endTime) &&
			schedules[i]!.open
		) {
			sameHoursDays++;
			continue;
		}

		break;
	}

	if (sameHoursDays === 7) {
		return (
			<p className='text-gray-600'>
				Ouvert tous les jours de {formatTime(schedules[0]!.startTime)} à{' '}
				{formatTime(schedules[0]!.endTime)}
			</p>
		);
	}

	if (sameHoursDays === 6) {
		return (
			<>
				<p className='text-gray-600'>
					Du lundi au samedi de {formatTime(schedules[0]!.startTime)}{' '}
					à {formatTime(schedules[0]!.endTime)}
				</p>

				{schedules.at(6) &&
					(!schedules.at(6)!.open ? (
						<p className='text-gray-600'>Fermé le dimanche.</p>
					) : (
						<p className='text-gray-600'>
							Le dimanche de{' '}
							{formatTime(schedules.at(6)!.startTime)} à{' '}
							{formatTime(schedules.at(6)!.endTime)}
						</p>
					))}
			</>
		);
	}

	if (sameHoursDays === 5) {
		const differDays = schedules.slice(5);

		return (
			<>
				<p className='text-gray-600'>
					Du lundi au vendredi de{' '}
					{formatTime(schedules[0]!.startTime)} à{' '}
					{formatTime(schedules[0]!.endTime)}
				</p>

				{differDays.every((x) => !x.open) ? (
					<p className='text-gray-600'>Fermé le week-end</p>
				) : (
					differDays.map((day) => (
						<p
							key={day.day}
							className='text-gray-600'>
							{day.open
								? `Le ${capitalize(days[day.day]!)} de ${formatTime(day.startTime)} à ${formatTime(day.endTime)}`
								: `Fermé le ${capitalize(days[day.day]!)}`}
						</p>
					))
				)}
			</>
		);
	}

	return (
		<div className='space-y-2'>
			{schedules.map((schedule) => (
				<p
					key={schedule.day}
					className='text-gray-600'>
					{capitalize(days[schedule.day]!)}&nbsp;:{' '}
					{schedule.open
						? `de ${formatTime(schedule.startTime)} à ${formatTime(schedule.endTime)}`
						: 'Fermé'}
				</p>
			))}
		</div>
	);
}
