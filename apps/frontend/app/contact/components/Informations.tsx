/** biome-ignore-all lint/style/noNonNullAssertion: we known what we are doing with this "days" array */
import type { Informations, Schedule } from '@repo/app-types';
import { capitalize, formatPhoneNumber } from '@repo/utils';
import { Clock, Mail, MapPin, Phone, TriangleAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
	informations: Informations;
	schedules: Schedule[];
}

const stagger = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ContactInformations({ informations, schedules }: Props) {
	return (
		<motion.div
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true }}
			variants={stagger}
			className='space-y-8'
		>
			<div>
				<div className='flex items-center gap-3 mb-6'>
					<span className='w-5 h-px bg-primary' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
						Coordonnées
					</span>
				</div>

				<div className='divide-y divide-border'>
					<motion.a
						variants={fadeUp}
						href={`tel:${formatPhoneNumber(informations.phone)}`}
						className='flex items-start gap-4 py-4 group'
					>
						<div className='w-8 h-8 border border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-colors'>
							<Phone className='h-3.5 w-3.5 text-primary group-hover:text-white transition-colors' />
						</div>
						<div>
							<div className='text-[9px] tracking-[2px] uppercase text-muted-foreground mb-1'>
								Téléphone
							</div>
							<div className='text-sm font-medium text-foreground group-hover:text-primary transition-colors'>
								{formatPhoneNumber(informations.phone)}
							</div>
						</div>
					</motion.a>

					<motion.a
						variants={fadeUp}
						href={`mailto:${informations.email}`}
						className='flex items-start gap-4 py-4 group'
					>
						<div className='w-8 h-8 border border-border flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-colors'>
							<Mail className='h-3.5 w-3.5 text-primary group-hover:text-white transition-colors' />
						</div>
						<div>
							<div className='text-[9px] tracking-[2px] uppercase text-muted-foreground mb-1'>
								Email
							</div>
							<div className='text-sm font-medium text-foreground group-hover:text-primary transition-colors break-all'>
								{informations.email}
							</div>
						</div>
					</motion.a>

					<motion.div
						variants={fadeUp}
						className='flex items-start gap-4 py-4'
					>
						<div className='w-8 h-8 border border-border flex items-center justify-center shrink-0'>
							<MapPin className='h-3.5 w-3.5 text-primary' />
						</div>
						<div>
							<div className='text-[9px] tracking-[2px] uppercase text-muted-foreground mb-1'>
								Zone d&apos;intervention
							</div>
							<div className='text-sm text-foreground'>
								{informations.actionRadius} km autour de {informations.actionAddress}
							</div>
						</div>
					</motion.div>

					<motion.div
						variants={fadeUp}
						className='flex items-start gap-4 py-4'
					>
						<div className='w-8 h-8 border border-border flex items-center justify-center shrink-0'>
							<Clock className='h-3.5 w-3.5 text-primary' />
						</div>
						<div>
							<div className='text-[9px] tracking-[2px] uppercase text-muted-foreground mb-1'>
								Disponibilités
							</div>
							<div className='text-sm text-foreground'>
								<SchedulesList schedules={schedules} />
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Urgences */}
			<motion.div
				variants={fadeUp}
				className='p-4 border border-amber-200 bg-amber-50'
			>
				<div className='flex items-start gap-3'>
					<TriangleAlert className='h-4 w-4 text-amber-600 mt-0.5 shrink-0' />
					<div>
						<div className='text-[9px] tracking-[2px] uppercase text-amber-700 font-semibold mb-2'>
							Urgences
						</div>
						<p className='text-xs text-amber-800/80 leading-relaxed'>
							En cas d&apos;urgence vétérinaire, veuillez contacter directement
							votre vétérinaire ou les urgences vétérinaires les plus proches.
						</p>
					</div>
				</div>
			</motion.div>
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
		return <span className='text-muted-foreground'>Aucun horaire disponible.</span>;
	}

	let sameScheduleCount = 1;
	for (let i = 1; i < schedules.length; i++) {
		if (
			schedules[i]!.time === schedules[0]!.time &&
			schedules[i]!.location === schedules[0]!.location &&
			schedules[i]!.open
		) {
			sameScheduleCount++;
			continue;
		}
		break;
	}

	if (sameScheduleCount === 7) {
		return (
			<span>
				Tous les jours {formatTime(schedules[0]!.time)}{' '}
				{formatLocation(schedules[0]!.location)}
			</span>
		);
	}

	if (sameScheduleCount === 6) {
		return (
			<span>
				Lun–Sam {formatTime(schedules[0]!.time)}{' '}
				{formatLocation(schedules[0]!.location)}
				{schedules.at(6) && (
					<>
						<br />
						{!schedules.at(6)!.open
							? 'Fermé le dimanche'
							: `Dim. ${formatTime(schedules.at(6)!.time)} ${formatLocation(schedules.at(6)!.location)}`}
					</>
				)}
			</span>
		);
	}

	if (sameScheduleCount === 5) {
		const differDays = schedules.slice(5);
		return (
			<span>
				Lun–Ven {formatTime(schedules[0]!.time)}{' '}
				{formatLocation(schedules[0]!.location)}
				{differDays.every((x) => !x.open) ? (
					<><br />Fermé le week-end</>
				) : (
					differDays.map((day) => (
						<span key={day.day}>
							<br />
							{day.open
								? `${capitalize(days[day.day]!)} ${formatTime(day.time)} ${formatLocation(day.location)}`
								: `Fermé le ${capitalize(days[day.day]!)}`}
						</span>
					))
				)}
			</span>
		);
	}

	return (
		<span>
			{schedules.map((s, i) => (
				<span key={s.day}>
					{i > 0 && <br />}
					{capitalize(days[s.day]!)} :{' '}
					{s.open ? `${formatTime(s.time)} ${formatLocation(s.location)}` : 'Fermé'}
				</span>
			))}
		</span>
	);
}

function formatTime(time: string) {
	return time.replace(/^(de|du)/i, (m) => m.toLowerCase());
}

function formatLocation(location: string) {
	if (location.toLowerCase().match(/^(à|au)/i)) {
		return location.replace(/^(à|À|au)/i, (m) => m.toLowerCase());
	}
	return `à ${location}`;
}
