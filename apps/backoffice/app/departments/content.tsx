'use client';

import { Department } from '@repo/app-types';
import { useActionState, useCallback, useMemo, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Badge, Button, Input } from '@repo/ui';
import { AnimatePresence, motion } from 'motion/react';

export default function DepartmentsContent({
	departments,
}: {
	departments: Department[];
}) {
	const [selectedDepartments, setSelectedDepartments] = useState<string[]>(
		departments.filter((x) => x.active).map((x) => x.code),
	);

	// Search
	const [searchTerm, setSearchTerm] = useState('');

	const filteredDepartments = useMemo(() => {
		return departments.filter(
			(dept) =>
				dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				dept.code.includes(searchTerm),
		);
	}, [departments, searchTerm]);

	const toggleDepartment = useCallback(
		(code: string) => {
			if (selectedDepartments.includes(code)) {
				setSelectedDepartments(
					selectedDepartments.filter((d) => d !== code),
				);
			} else {
				setSelectedDepartments([...selectedDepartments, code]);
			}
		},
		[selectedDepartments],
	);

	const [error, action, pending] = useActionState(() => {}, null);

	return (
		<form
			action={action}
			className='space-y-6'>
			{/* Info */}
			<div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
				<div className='flex gap-3'>
					<MapPin className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
					<div>
						<p className='font-semibold text-blue-900 mb-1'>
							Zone d&apos;intervention
						</p>
						<p className='text-sm text-blue-800'>
							Sélectionnez les départements où vous intervenez.
							Ils seront affichés en surbrillance sur la carte de
							la page contact.
						</p>
					</div>
				</div>
			</div>

			{/* Search */}
			<div className='relative'>
				<Search className='absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
				<Input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					placeholder='Rechercher un département...'
					className='pl-12 h-12 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
				/>
			</div>

			{/* Selected departments */}
			<div className='bg-linear-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200'>
				<div className='flex items-center justify-between mb-4'>
					<h3 className='font-semibold text-gray-900'>
						Départements sélectionnés ({selectedDepartments.length})
					</h3>
					{selectedDepartments.length > 0 && (
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={() => setSelectedDepartments([])}
							className='text-red-600 hover:text-red-700 hover:bg-red-50'>
							<X className='w-4 h-4 mr-2' />
							Tout effacer
						</Button>
					)}
				</div>

				<AnimatePresence mode='popLayout'>
					{selectedDepartments.length === 0 ? (
						<div className='text-center py-8'>
							<div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4'>
								<MapPin className='w-8 h-8 text-gray-400' />
							</div>
							<p className='text-gray-600'>
								Aucun département sélectionné
							</p>
						</div>
					) : (
						<div className='flex flex-wrap gap-2'>
							{selectedDepartments.map((code) => {
								const dept = departments.find(
									(d) => d.code === code,
								);

								if (!dept) return null;

								return (
									<motion.div
										key={code}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.8 }}>
										<Badge className='px-3 py-2 bg-linear-to-r from-[#7f5539] to-[#5a3a26] text-white border-0 hover:shadow-lg transition-all duration-200'>
											<MapPin className='w-3 h-3 mr-2' />
											{dept.code} - {dept.name}
											<button
												type='button'
												onClick={() =>
													toggleDepartment(dept.code)
												}
												className='ml-2 hover:text-red-200'>
												<X className='h-3 w-3' />
											</button>
										</Badge>
									</motion.div>
								);
							})}
						</div>
					)}
				</AnimatePresence>
			</div>

			{/* Departments grid */}
			<div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
				<div className='p-4 bg-gray-50 border-b border-gray-200'>
					<h3 className='font-semibold text-gray-900'>
						Tous les départements
						{searchTerm &&
							` (${filteredDepartments.length} résultat${filteredDepartments.length > 1 ? 's' : ''})`}
					</h3>
				</div>

				<div className='p-4'>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto'>
						{filteredDepartments.map((dept) => {
							const isSelected = selectedDepartments.includes(
								dept.code,
							);
							return (
								<button
									key={dept.code}
									type='button'
									onClick={() => toggleDepartment(dept.code)}
									className={`text-left px-4 py-3 rounded-xl transition-all duration-200 ${
										isSelected
											? 'bg-linear-to-r from-[#7f5539] to-[#5a3a26] text-white shadow-md'
											: 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-sm'
									}`}>
									<span className='text-sm font-medium'>
										{dept.code} - {dept.name}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
