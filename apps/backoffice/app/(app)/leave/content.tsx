'use client';

import type { Leave } from '@repo/app-types';
import { Button } from '@repo/ui';
import { Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type LeaveForm = {
	id: number;
	from: string;
	to: string;
	isNew?: boolean;
};

function toInputDate(date: Date | string): string {
	return new Date(date).toISOString().slice(0, 10);
}

export default function LeaveContent({ leaves: dbLeaves }: { leaves: Leave[] }) {
	const [leaves, setLeaves] = useState<LeaveForm[]>(
		(dbLeaves ?? []).map((l) => ({
			id: l.id,
			from: toInputDate(l.from),
			to: toInputDate(l.to),
		}))
	);

	const addLeave = useCallback(() => {
		const today = toInputDate(new Date());
		setLeaves((prev) => [
			...prev,
			{ id: Date.now(), from: today, to: today, isNew: true },
		]);
	}, []);

	const updateLeave = useCallback(
		(id: number, field: 'from' | 'to', value: string) => {
			setLeaves((prev) =>
				prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
			);
		},
		[]
	);

	const saveLeave = useCallback(async (leave: LeaveForm) => {
		if (!leave.from || !leave.to) {
			toast.error('Les dates de début et de fin sont requises.');
			return;
		}
		if (new Date(leave.from) > new Date(leave.to)) {
			toast.error('La date de début doit être avant la date de fin.');
			return;
		}

		const body = { from: leave.from, to: leave.to };

		if (leave.isNew) {
			const promise = fetch('/api/leave', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}).then(async (res) => {
				const data = await res.json();
				if (!data.success) throw new Error(data.message);
				setLeaves((prev) =>
					prev.map((l) =>
						l.id === leave.id
							? { ...l, id: data.responseObject.id, isNew: undefined }
							: l
					)
				);
			});
			toast.promise(promise, {
				loading: 'Création du congé...',
				success: 'Congé créé avec succès !',
				error: 'Erreur lors de la création du congé.',
			});
		} else {
			const promise = fetch(`/api/leave/${leave.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			}).then(async (res) => {
				const data = await res.json();
				if (!data.success) throw new Error(data.message);
			});
			toast.promise(promise, {
				loading: 'Mise à jour du congé...',
				success: 'Congé mis à jour avec succès !',
				error: 'Erreur lors de la mise à jour du congé.',
			});
		}
	}, []);

	const deleteLeave = useCallback(async (leave: LeaveForm) => {
		if (leave.isNew) {
			setLeaves((prev) => prev.filter((l) => l.id !== leave.id));
			return;
		}

		const promise = fetch(`/api/leave/${leave.id}`, {
			method: 'DELETE',
		}).then(async (res) => {
			const data = await res.json();
			if (!data.success) throw new Error(data.message);
			setLeaves((prev) => prev.filter((l) => l.id !== leave.id));
		});

		toast.promise(promise, {
			loading: 'Suppression du congé...',
			success: 'Congé supprimé.',
			error: 'Erreur lors de la suppression du congé.',
		});
	}, []);

	return (
		<div className='space-y-6'>
			<div className='grid gap-4'>
				<AnimatePresence>
					{leaves.map((leave) => (
						<motion.div
							key={leave.id}
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2 }}
							className='flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm'
						>
							<div className='flex flex-col gap-1 flex-1'>
								<label
									htmlFor={`from-${leave.id}`}
									className='text-sm font-medium text-gray-600'
								>
									Début
								</label>
								<input
									id={`from-${leave.id}`}
									type='date'
									value={leave.from}
									onChange={(e) =>
										updateLeave(leave.id, 'from', e.target.value)
									}
									className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/40'
								/>
							</div>

							<div className='flex flex-col gap-1 flex-1'>
								<label
									htmlFor={`to-${leave.id}`}
									className='text-sm font-medium text-gray-600'
								>
									Fin
								</label>
								<input
									id={`to-${leave.id}`}
									type='date'
									value={leave.to}
									onChange={(e) =>
										updateLeave(leave.id, 'to', e.target.value)
									}
									className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7f5539]/40'
								/>
							</div>

							<div className='flex gap-2'>
								<Button
									type='button'
									onClick={() => saveLeave(leave)}
									className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200 cursor-pointer text-sm'
								>
									{leave.isNew ? 'Créer' : 'Enregistrer'}
								</Button>
								<button
									type='button'
									onClick={() => deleteLeave(leave)}
									className='p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer'
									aria-label='Supprimer ce congé'
								>
									<Trash2 size={18} />
								</button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>

				{leaves.length === 0 && (
					<p className='text-center text-gray-400 text-sm py-8'>
						Aucun congé planifié.
					</p>
				)}

				<button
					type='button'
					onClick={addLeave}
					className='flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-100/50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer'
				>
					<Plus />
					Ajouter un congé
				</button>
			</div>
		</div>
	);
}
