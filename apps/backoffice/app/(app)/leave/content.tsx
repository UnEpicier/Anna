'use client';

import type { Leave } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
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

export default function LeaveContent({
	leaves: dbLeaves,
}: {
	leaves: Leave[];
}) {
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
							? {
									...l,
									id: data.responseObject.id,
									isNew: undefined,
								}
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
				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					throw new Error(data.message ?? 'Erreur serveur');
				}
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
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message ?? 'Erreur serveur');
			}
			setLeaves((prev) => prev.filter((l) => l.id !== leave.id));
		});
		toast.promise(promise, {
			loading: 'Suppression du congé...',
			success: 'Congé supprimé.',
			error: 'Erreur lors de la suppression du congé.',
		});
	}, []);

	return (
		<div className='space-y-3'>
			<AnimatePresence>
				{leaves.map((leave) => (
					<motion.div
						key={leave.id}
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.15 }}
						className='flex flex-col sm:flex-row items-start sm:items-end gap-4 p-4 border border-border bg-white'
					>
						<div className='flex flex-col gap-1.5 flex-1'>
							<Label
								htmlFor={`from-${leave.id}`}
								className='text-xs text-muted-foreground'
							>
								Début
							</Label>
							<Input
								id={`from-${leave.id}`}
								type='date'
								value={leave.from}
								onChange={(e) =>
									updateLeave(
										leave.id,
										'from',
										e.target.value
									)
								}
							/>
						</div>

						<div className='flex flex-col gap-1.5 flex-1'>
							<Label
								htmlFor={`to-${leave.id}`}
								className='text-xs text-muted-foreground'
							>
								Fin
							</Label>
							<Input
								id={`to-${leave.id}`}
								type='date'
								value={leave.to}
								onChange={(e) =>
									updateLeave(leave.id, 'to', e.target.value)
								}
							/>
						</div>

						<div className='flex gap-2'>
							<Button
								type='button'
								onClick={() => saveLeave(leave)}
								className='bg-primary hover:bg-primary/85 text-white text-sm'
							>
								{leave.isNew ? 'Créer' : 'Enregistrer'}
							</Button>
							<button
								type='button'
								onClick={() => deleteLeave(leave)}
								className='p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors'
								aria-label='Supprimer ce congé'
							>
								<Trash2 className='w-4 h-4' />
							</button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{leaves.length === 0 && (
				<p className='text-center text-muted-foreground text-sm py-8'>
					Aucun congé planifié.
				</p>
			)}

			<button
				type='button'
				onClick={addLeave}
				className='w-full flex items-center justify-center gap-2 p-4 border border-dashed border-border hover:border-primary/40 hover:bg-primary/3 text-muted-foreground hover:text-primary transition-colors'
			>
				<Plus className='w-4 h-4' />
				<span className='text-sm'>Ajouter un congé</span>
			</button>
		</div>
	);
}
