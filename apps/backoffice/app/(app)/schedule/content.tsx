'use client';

import type { Schedule } from '@repo/app-types';
import { Button } from '@repo/ui';
import { Calendar, Check, Clock } from 'lucide-react';
import { useCallback, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';
import ScheduleRow from './components/ScheduleRow';

export default function ScheduleContent({
	schedules,
}: {
	schedules: Schedule[];
}) {
	const [isPending, setIsPending] = useState(false);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
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
				headers: { 'Content-Type': 'application/json' },
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
		<form onSubmit={onSubmit} className='space-y-4'>
			{/* Column headers */}
			<div className='grid grid-cols-4 gap-4 px-4 pb-2 border-b border-border'>
				<div className='flex items-center gap-2 text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold'>
					<Calendar className='w-3.5 h-3.5' />
					Jour
				</div>
				<div className='flex items-center gap-2 text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold'>
					<Clock className='w-3.5 h-3.5' />
					Horaire
				</div>
				<div className='flex items-center gap-2 text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold'>
					<Clock className='w-3.5 h-3.5' />
					Lieu
				</div>
				<div className='flex items-center gap-2 text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold'>
					<Check className='w-3.5 h-3.5' />
					Ouvert
				</div>
			</div>

			<div className='divide-y divide-border'>
				{schedules.map((schedule) => (
					<ScheduleRow
						key={schedule.day}
						schedule={schedule}
						isPending={isPending}
					/>
				))}
			</div>

			<div className='pt-4 border-t border-border'>
				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary hover:bg-primary/85 text-white'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
