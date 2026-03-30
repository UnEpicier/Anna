import type { Schedule } from '@repo/app-types';
import { Input, Label, Switch } from '@repo/ui';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const frenchDays: Record<string, string> = {
	monday: 'Lundi',
	tuesday: 'Mardi',
	wednesday: 'Mercredi',
	thursday: 'Jeudi',
	friday: 'Vendredi',
	saturday: 'Samedi',
	sunday: 'Dimanche',
};

export default function ScheduleRow({
	schedule: parentSchedule,
	isPending,
}: {
	schedule: Schedule;
	isPending: boolean;
}) {
	const [schedule, setSchedule] = useState(parentSchedule);

	const onCheckedChange = useCallback(
		(checked: boolean) => {
			if (checked && (schedule.time.length === 0 || schedule.location.length === 0)) {
				toast.warning("Les champs horaires et lieu doivent d'abord être remplis");
				return;
			}
			setSchedule((prev) => ({ ...prev, open: !prev.open }));
		},
		[schedule]
	);

	const onFieldChange = useCallback(
		(field: 'location' | 'time', value: string) => {
			let openState = schedule.open;
			if (openState && value.length === 0) openState = false;
			setSchedule((prev) => ({ ...prev, [field]: value, open: openState }));
		},
		[schedule]
	);

	return (
		<div className='grid grid-cols-4 gap-4 px-4 py-3 items-center'>
			<p className='text-sm font-medium text-foreground'>
				{frenchDays[schedule.day]}
			</p>

			<Label htmlFor={`time-${schedule.day}`} className='sr-only'>
				Heure d&apos;ouverture
			</Label>
			<Input
				id={`time-${schedule.day}`}
				name={`time-${schedule.day}`}
				type='text'
				value={schedule.time}
				onChange={(ev) => onFieldChange('time', ev.target.value)}
				autoComplete='off'
				required={schedule.open}
				disabled={isPending}
			/>

			<Label htmlFor={`location-${schedule.day}`} className='sr-only'>
				Lieu
			</Label>
			<Input
				id={`location-${schedule.day}`}
				name={`location-${schedule.day}`}
				defaultValue={schedule.location}
				type='text'
				onChange={(ev) => onFieldChange('location', ev.target.value)}
				autoComplete='off'
				required={schedule.open}
				disabled={isPending}
			/>

			<Label htmlFor={`open-${schedule.day}`} className='sr-only'>
				Ouvert
			</Label>
			<Switch
				id={`open-${schedule.day}`}
				checked={schedule.open}
				name={`open-${schedule.day}`}
				disabled={isPending}
				onCheckedChange={onCheckedChange}
			/>
		</div>
	);
}
