'use client';

import type { Schedule } from '@repo/app-types';
import { Button, Input, Switch } from '@repo/ui';
import { Calendar, Check, Clock } from 'lucide-react';
import { useActionState } from 'react';

const frenchDays: Record<string, string> = {
	monday: 'Lundi',
	tuesday: 'Mardi',
	wednesday: 'Mercredi',
	thursday: 'Jeudi',
	friday: 'Vendredi',
	saturday: 'Samedi',
	sunday: 'Dimanche',
};

export default function ScheduleContent({
	schedules,
}: {
	schedules: Schedule[];
}) {
	const [_error, action, _pending] = useActionState(() => {}, null);

	return (
		<form
			action={action}
			className='space-y-6'
		>
			<div className='grid grid-cols-4 gap-6 mb-2'>
				<div className='flex gap-2 items-center'>
					<Calendar className='w-4 h-4 text-gray-500' />
					<p className='text-gray-700'>Jour</p>
				</div>

				<div className='flex gap-2 items-center'>
					<Clock className='w-4 h-4 text-gray-500' />
					<p className='text-gray-700'>Horaire d&apos;ouverture</p>
				</div>

				<div className='flex gap-2 items-center'>
					<Clock className='w-4 h-4 text-gray-500' />
					<p className='text-gray-700'>Horaire de fermeture</p>
				</div>

				<div className='flex gap-2 items-center'>
					<Check />
					<p className='text-gray-700'>Ouvert</p>
				</div>
			</div>

			{schedules.map((schedule) => (
				<div
					key={schedule.day}
					className='grid grid-cols-4 gap-6'
				>
					<p>{frenchDays[schedule.day]}</p>

					<Input
						id={`startTime-${schedule.day}`}
						name={`startTime-${schedule.day}`}
						type='time'
						defaultValue={schedule.startTime
							.toTimeString()
							.replace(/(:\d+ .*)/, '')}
						autoComplete='off'
						className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
					/>

					<Input
						id={`endTime-${schedule.day}`}
						name={`endTime-${schedule.day}`}
						defaultValue={schedule.endTime
							.toTimeString()
							.replace(/(:\d+ .*)/, '')}
						type='time'
						autoComplete='off'
						className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
					/>

					<Switch
						id={`open-${schedule.day}`}
						checked={schedule.open}
						// onCheckedChange={(checked) =>
						// 	setFormData({
						// 		...formData,
						// 		sundayAvailable: checked,
						// 	})
						// }
						className='data-[state=checked]:bg-[#7f5539]'
					/>
				</div>
			))}

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
