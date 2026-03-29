'use client';

import type { Schedule } from '@repo/app-types';
import { Button, Input, Label, Switch } from '@repo/ui';
import { Calendar, Check, Clock } from 'lucide-react';
import { type FormEvent, useCallback, useState } from 'react';
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

export default function ScheduleContent({
	schedules,
}: {
	schedules: Schedule[];
}) {
	const [isPending, setIsPending] = useState(false);

	const onSubmit = useCallback(
		async (ev: FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			setIsPending(true);

			const formData = new FormData(ev.currentTarget);

			const updatedSchedules = schedules.map((schedule) => ({
				...schedule,
				time: formData.get(`time-${schedule.day}`) as string,
				location: formData.get(`location-${schedule.day}`) as string,
				open: formData.get(`open-${schedule.day}`) === 'on',
			}));

			const promise = fetch('/api/schedules', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedSchedules),
			});

			await toast
				.promise(promise, {
					loading: 'Mise à jour des horaires en cours...',
					success: 'Horaires mis à jour avec succès !',
					error: 'Une erreur est survenue lors de la mise à jour des horaires.',
				})
				.unwrap();

			setIsPending(false);
		},
		[schedules]
	);

	return (
		<form
			onSubmit={onSubmit}
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
					<Check className='w-4 h-4 text-gray-500' />
					<p className='text-gray-700'>Ouvert</p>
				</div>
			</div>

			{schedules.map((schedule) => (
				<div
					key={schedule.day}
					className='grid grid-cols-4 gap-6'
				>
					<p>{frenchDays[schedule.day]}</p>

					<Label
						htmlFor={`time-${schedule.day}`}
						className='sr-only'
					>
						Heure d&apos;ouverture
					</Label>
					<Input
						id={`time-${schedule.day}`}
						name={`time-${schedule.day}`}
						type='text'
						defaultValue={schedule.time}
						autoComplete='off'
						required={schedule.open}
						disabled={isPending}
						className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
					/>

					<Label
						htmlFor={`location-${schedule.day}`}
						className='sr-only'
					>
						Lieu
					</Label>
					<Input
						id={`location-${schedule.day}`}
						name={`location-${schedule.day}`}
						defaultValue={schedule.location}
						type='text'
						autoComplete='off'
						required={schedule.open}
						disabled={isPending}
						className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
					/>

					<Label
						htmlFor={`open-${schedule.day}`}
						className='sr-only'
					>
						Ouvert
					</Label>
					<Switch
						id={`open-${schedule.day}`}
						defaultChecked={schedule.open}
						name={`open-${schedule.day}`}
						disabled={isPending}
						className='data-[state=checked]:bg-[#7f5539]'
					/>
				</div>
			))}

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					disabled={isPending}
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
