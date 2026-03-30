'use client';

import type { Department } from '@repo/app-types';
import { Button, Input } from '@repo/ui';
import { LoaderCircle, MapPin, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useMemo, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';

export default function DepartmentsContent({
	departments,
}: {
	departments: Department[];
}) {
	const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
		departments.filter((x) => x.active).map((x) => x.code)
	);

	const [searchTerm, setSearchTerm] = useState('');

	const filteredDepartments = useMemo(() => {
		return departments.filter(
			(dept) =>
				dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				dept.code.includes(searchTerm)
		);
	}, [departments, searchTerm]);

	const toggleDepartment = useCallback(
		(code: string) => {
			if (selectedDepartments.includes(code)) {
				setSelectedDepartments(selectedDepartments.filter((d) => d !== code));
			} else {
				setSelectedDepartments([...selectedDepartments, code]);
			}
		},
		[selectedDepartments]
	);

	const [isPending, setIsPending] = useState(false);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			setIsPending(true);

			const promise = fetch('/api/departments', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(selectedDepartments),
			});

			await toast
				.promise(promise, {
					loading: 'Enregistrement en cours...',
					success: 'Départements mis à jour avec succès.',
					error: 'Une erreur est survenue lors de la mise à jour.',
				})
				.unwrap();

			setIsPending(false);
		},
		[selectedDepartments]
	);

	return (
		<form onSubmit={onSubmit} className='space-y-6'>
			{/* Info banner */}
			<div className='border border-sky-200 bg-sky-50 p-4 flex gap-3'>
				<MapPin className='w-4 h-4 text-sky-600 shrink-0 mt-0.5' />
				<div>
					<p className='text-sm font-semibold text-sky-900 mb-0.5'>
						Zone d&apos;intervention
					</p>
					<p className='text-sm text-sky-800/80'>
						Sélectionnez les départements où vous intervenez. Ils seront affichés
						en surbrillance sur la carte de la page contact.
					</p>
				</div>
			</div>

			{/* Selected departments */}
			<div className='border border-border p-5'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<span className='w-4 h-px bg-primary/60' />
						<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
							Sélectionnés ({selectedDepartments.length})
						</span>
					</div>
					{selectedDepartments.length > 0 && (
						<button
							type='button'
							onClick={() => setSelectedDepartments([])}
							className='text-[10px] tracking-[1px] uppercase text-destructive/70 hover:text-destructive transition-colors flex items-center gap-1.5'
						>
							<X className='w-3 h-3' />
							Tout effacer
						</button>
					)}
				</div>

				<AnimatePresence mode='popLayout'>
					{selectedDepartments.length === 0 ? (
						<div className='py-8 text-center'>
							<div className='w-10 h-10 border border-border flex items-center justify-center mx-auto mb-3'>
								<MapPin className='w-4 h-4 text-muted-foreground' />
							</div>
							<p className='text-sm text-muted-foreground'>
								Aucun département sélectionné
							</p>
						</div>
					) : (
						<div className='flex flex-wrap gap-2'>
							{selectedDepartments.map((code) => {
								const dept = departments.find((d) => d.code === code);
								if (!dept) return null;
								return (
									<motion.button
										key={code}
										type='button'
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.9 }}
										onClick={() => toggleDepartment(dept.code)}
										className='flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium hover:bg-primary/85 transition-colors group'
									>
										<MapPin className='w-3 h-3' />
										{dept.code} — {dept.name}
										<X className='w-3 h-3 opacity-60 group-hover:opacity-100' />
									</motion.button>
								);
							})}
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* Search */}
			<div className='relative'>
				<Search className='absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
				<Input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Rechercher un département...'
					disabled={isPending}
					className='pl-10'
				/>
			</div>

			{/* Departments grid */}
			<div className='border border-border overflow-hidden'>
				<div className='px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-3'>
					<span className='text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold'>
						Tous les départements
						{searchTerm && ` — ${filteredDepartments.length} résultat${filteredDepartments.length > 1 ? 's' : ''}`}
					</span>
				</div>

				<div className='p-4 max-h-96 overflow-y-auto'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5'>
						{filteredDepartments.map((dept) => {
							const isSelected = selectedDepartments.includes(dept.code);
							return (
								<button
									key={dept.code}
									type='button'
									onClick={() => toggleDepartment(dept.code)}
									className={`text-left px-4 py-2.5 border transition-colors duration-150 text-sm ${
										isSelected
											? 'border-primary bg-primary text-white'
											: 'border-border bg-white hover:border-primary/40 hover:bg-primary/4 text-foreground'
									}`}
								>
									<span className='font-medium tabular-nums'>{dept.code}</span>
									<span className='text-current/70 ml-2'>{dept.name}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Submit */}
			<div className='pt-2 border-t border-border flex items-center justify-between'>
				<span className='text-xs text-muted-foreground'>
					{selectedDepartments.length} département{selectedDepartments.length > 1 ? 's' : ''} sélectionné{selectedDepartments.length > 1 ? 's' : ''}
				</span>
				<Button type='submit' disabled={isPending} className='bg-primary hover:bg-primary/85 text-white'>
					{isPending ? (
						<>
							<LoaderCircle className='animate-spin' />
							Enregistrement...
						</>
					) : (
						'Enregistrer les modifications'
					)}
				</Button>
			</div>
		</form>
	);
}
